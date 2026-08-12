import { NextResponse } from "next/server";
// ⚠️ Ensure this path matches your project's Firebase Admin export
import { adminDb } from "@/lib/firebase/admin"; // 👈 Updated to adminDb!

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET_KEY!;
const PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || "Failed to authenticate with PayPal");
  }
  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const { orderID } = await req.json();

    if (!orderID) {
      return NextResponse.json({ error: "Missing PayPal Order ID" }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();

    // 1. CAPTURE FUNDS FROM PAYPAL
    console.log(`⚡ Capturing PayPal Order: ${orderID}`);
    const captureResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const captureData = await captureResponse.json();

    if (!captureResponse.ok || captureData.status !== "COMPLETED") {
      console.error("PayPal Capture Error:", captureData);
      throw new Error(captureData.message || "PayPal failed to capture payment.");
    }

    // 2. EXTRACT BAZARIA ORDER ID FROM PAYPAL CUSTOM_ID
    const purchaseUnit = captureData.purchase_units?.[0];
    const orderId = purchaseUnit?.payments?.captures?.[0]?.custom_id || purchaseUnit?.custom_id;

    console.log(`💰 PayPal Capture Succeeded for Bazaria Order: ${orderId}`);

    if (orderId) {
      // 3. UPDATE ORDER STATUS IN FIRESTORE
      const orderRef = adminDb.collection("orders").doc(orderId);
      const orderDoc = await orderRef.get();

      if (orderDoc.exists) {
        const orderData = orderDoc.data();

        await orderRef.update({
          status: "PAID",
          "paymentDetails.paypalCaptureId": captureData.id,
          "timestamps.paidAt": new Date().toISOString()
        });

        // 4. MARK ASSETS AS SOLD
        if (orderData?.items && Array.isArray(orderData.items)) {
          for (const item of orderData.items) {
            if (item.id) {
              await adminDb.collection("assets").doc(item.id).update({
                status: "SOLD",
                soldAt: new Date().toISOString()
              }).catch((e) => console.log(`Note: Asset ${item.id} status update skipped or handled elsewhere.`));
            }
          }
        }

        // 5. TRIGGER FEDEX LABEL GENERATION
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        fetch(`${baseUrl}/api/shipping/create-label`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderId,
            buyerAddress: orderData?.fulfillment?.destination,
            sellerAddress: orderData?.fulfillment?.origin,
            items: orderData?.items,
            dropOffMethod: "DROPOFF"
          })
        }).then(res => res.json()).then(labelRes => {
          console.log(`📦 FedEx Label Generation Response for ${orderId}:`, labelRes);
        }).catch(err => {
          console.error(`❌ Automated Label Trigger Error for ${orderId}:`, err.message);
        });
      }
    }

    return NextResponse.json({ success: true, captureData });

  } catch (error: any) {
    console.error("❌ PayPal Capture Exception:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
