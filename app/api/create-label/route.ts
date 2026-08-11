import { NextResponse } from "next/server";

const FEDEX_API_KEY = process.env.FEDEX_API_KEY;
const FEDEX_SECRET_KEY = process.env.FEDEX_SECRET_KEY;
const FEDEX_ACCOUNT_NUMBER = process.env.FEDEX_ACCOUNT_NUMBER;

// 🧠 IN-MEMORY TOKEN CACHE
let cachedToken: string | null = null;
let tokenExpiryTime: number = 0;

async function getFedexToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiryTime) return cachedToken;

  const authUrl = "https://apis-sandbox.fedex.com/oauth/token";
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: FEDEX_API_KEY as string,
    client_secret: FEDEX_SECRET_KEY as string,
  });

  const response = await fetch(authUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) throw new Error("Failed to authenticate with FedEx API");
  
  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiryTime = now + ((data.expires_in || 3600) - 60) * 1000;
  
  return cachedToken;
}

export async function POST(req: Request) {
  try {
    const { orderId, buyerAddress, sellerAddress, items, dropOffMethod } = await req.json();

    if (!buyerAddress || !sellerAddress) {
      return NextResponse.json({ error: "Missing origin or destination address" }, { status: 400 });
    }

    console.log(`🚀 Generating FedEx Label for Order: ${orderId}`);

    const token = await getFedexToken();

    // 📦 DYNAMIC DIMENSIONAL WEIGHT MAPPING
    const packageLineItems = items.map((item: any, index: number) => ({
      sequenceNumber: index + 1,
      weight: { units: "LB", value: item.weight || 10 },
      dimensions: { length: item.length || 12, width: item.width || 12, height: item.height || 12, units: "IN" }
    }));

    // Determine drop-off vs call tag for the FedEx manifest
    const dropoffType = dropOffMethod === "CALL_TAG" ? "CONTACT_FEDEX_TO_SCHEDULE" : "DROPOFF_AT_FEDEX_LOCATION";

    // 🚀 HIT THE FEDEX SHIP API
    const shipResponse = await fetch("https://apis-sandbox.fedex.com/ship/v1/shipments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        // 👇 This must be at the very root of the object!
        labelResponseOptions: "URL_ONLY",
        accountNumber: { value: FEDEX_ACCOUNT_NUMBER },
        
        requestedShipment: {
          shipper: {
            contact: {
              personName: "Bazaria Seller", 
              phoneNumber: "5551234567"
            },
            address: shipperAddress
          },
          recipients: [
            {
              contact: {
                personName: "Bazaria Buyer",
                phoneNumber: "5559876543" 
              },
              address: recipientAddress
            }
          ],
          shippingChargesPayment: {
            paymentType: "SENDER",
            payor: { responsibleParty: { accountNumber: { value: FEDEX_ACCOUNT_NUMBER } } }
          },
          pickupType: dropoffType,
          serviceType: "FEDEX_GROUND",
          packagingType: "YOUR_PACKAGING",
          labelSpecification: {
            imageType: "PDF",
            labelStockType: "PAPER_85X11_TOP_HALF_LABEL"
          },
          requestedPackageLineItems: packageLineItems
        }
      })
    });

    const shipData = await shipResponse.json();

    if (!shipResponse.ok) {
      console.error("FedEx Label Error:", shipData);
      throw new Error(shipData?.errors?.[0]?.message || "Failed to generate FedEx label");
    }

    // 🎯 EXTRACT THE CRITICAL DATA
    const transactionDetails = shipData.output.transactionShipments[0];
    const trackingNumber = transactionDetails.pieceResponses[0].trackingNumber;
    
    // FedEx returns the PDF label as a Base64 encoded string
    const base64Label = transactionDetails.pieceResponses[0].packageDocuments[0].url;

    console.log(`✅ Label Generated! Tracking: ${trackingNumber}`);

    return NextResponse.json({
      success: true,
      trackingNumber: trackingNumber,
      labelUrl: base64Label // In production, we'd save this to Firebase Storage and return the public URL
    });

  } catch (error: any) {
    console.error("❌ Shipping API Exception:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
