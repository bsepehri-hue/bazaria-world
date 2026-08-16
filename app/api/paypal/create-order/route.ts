import { NextResponse } from "next/server";
// ⚠️ Ensure this path matches how adminDb is imported in your webhook/Stripe routes
import { adminDb } from "@/lib/firebase/admin"; // 👈 Updated to adminDb!

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET_KEY!;
const PAYPAL_BASE_URL = "https://api-m.paypal.com";

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
    const body = await req.json();
    const { amount, items, deliveryMethod, buyerAddress, merchantAddress } = body;

    if (!amount || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required order payload" }, { status: 400 });
    }

    // 1. GENERATE SECURE BAZARIA ORDER ID
    const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // 2. SAFE ADDRESS FALLBACKS
    const finalOrigin = merchantAddress || {
      streetLines: ["1000 Brickell Ave"],
      city: "Miami",
      stateOrProvinceCode: "FL",
      postalCode: "33131",
      countryCode: "US"
    };

    const finalDestination = buyerAddress || {
      streetLines: ["1600 Pennsylvania Avenue NW"],
      city: "Washington",
      stateOrProvinceCode: "DC",
      postalCode: "20500",
      countryCode: "US"
    };

    // 3. SECURE FIRESTORE WRITE (Admin SDK)
    console.log(`📝 Creating pending order ${orderId} in Firestore via PayPal route...`);
    await adminDb.collection("orders").doc(orderId).set({
      orderId: orderId,
      status: "PENDING_PAYMENT",
      paymentGateway: "PAYPAL",
      participants: {
        buyerId: "guest_checkout",
        sellerId: items[0]?.ownerId || "steward_node"
      },
      items: items,
      fulfillment: {
        logisticsMethod: deliveryMethod || "SHIPPING",
        shippingStatus: "PENDING",
        origin: finalOrigin,
        destination: finalDestination
      },
      timestamps: { createdAt: new Date().toISOString() }
    });

    // 4. GENERATE PAYPAL ORDER
    const accessToken = await getPayPalAccessToken();
    const paypalResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: orderId, // 🔥 Links Bazaria orderId to PayPal capture response
            amount: {
              currency_code: "USD",
              value: Number(amount).toFixed(2),
            },
            description: `Bazaria Marketplace Order (${items.length} items)`,
          },
        ],
      }),
    });

    const paypalOrder = await paypalResponse.json();

    if (!paypalResponse.ok) {
      console.error("PayPal Order Creation Error:", paypalOrder);
      throw new Error(paypalOrder.message || "Failed to create PayPal order");
    }

    return NextResponse.json({ id: paypalOrder.id, orderId: orderId });

  } catch (error: any) {
    console.error("❌ PayPal Create Order API Exception:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
