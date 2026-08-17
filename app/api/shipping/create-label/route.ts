import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin"; // Or wherever your admin SDK is initialized

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

// 🛠️ HELPER TO FLEXIBLY NORMALIZE ADDRESS KEYS
function normalizeAddress(addr: any, defaultFallback: any) {
  if (!addr) return defaultFallback;

  const street = 
    addr.street || 
    (Array.isArray(addr.streetLines) ? addr.streetLines[0] : addr.streetLines) || 
    defaultFallback.streetLines[0];

  const city = addr.city || defaultFallback.city;
  const state = addr.state || addr.stateOrProvinceCode || defaultFallback.stateOrProvinceCode;
  const zip = addr.zipCode || addr.postalCode || defaultFallback.postalCode;
  const country = addr.countryCode || addr.country || "US";

  return {
    streetLines: [street],
    city: city,
    stateOrProvinceCode: state,
    postalCode: zip,
    countryCode: country
  };
}

export async function POST(req: Request) {
  try {
    const { orderId, buyerAddress, sellerAddress, items, dropOffMethod } = await req.json();

    console.log(`🚀 Generating FedEx Label for Order: ${orderId}`);

    // 🏡 NORMALIZE ADDRESSES
    const shipperAddress = normalizeAddress(sellerAddress, {
      streetLines: ["1000 Brickell Ave"],
      city: "Miami",
      stateOrProvinceCode: "FL",
      postalCode: "33131",
      countryCode: "US"
    });

    const recipientAddress = normalizeAddress(buyerAddress, {
      streetLines: ["1600 Pennsylvania Avenue NW"],
      city: "Washington",
      stateOrProvinceCode: "DC",
      postalCode: "20500",
      countryCode: "US"
    });

    const token = await getFedexToken();

    // 📦 DYNAMIC DIMENSIONAL WEIGHT MAPPING
    const rawItems = (items && Array.isArray(items) && items.length > 0) 
      ? items 
      : [{ weight: 10, length: 12, width: 12, height: 12 }];

    const packageLineItems = rawItems.map((item: any, index: number) => ({
      sequenceNumber: index + 1,
      weight: { units: "LB", value: Number(item.weight) || 10 },
      dimensions: { length: Number(item.length) || 12, width: Number(item.width) || 12, height: Number(item.height) || 12, units: "IN" }
    }));

    const dropoffType = dropOffMethod === "CALL_TAG" ? "CONTACT_FEDEX_TO_SCHEDULE" : "DROPOFF_AT_FEDEX_LOCATION";

    // 🚀 HIT THE FEDEX SHIP API
    const shipResponse = await fetch("https://apis-sandbox.fedex.com/ship/v1/shipments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        // 👇 PLACED PERFECTLY AT THE ROOT LEVEL 👇
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
      console.error("FedEx Label Error Details:", JSON.stringify(shipData.errors, null, 2));
      throw new Error(shipData?.errors?.[0]?.message || "Failed to generate FedEx label");
    }

    // 🎯 EXTRACT THE CRITICAL DATA
    const transactionDetails = shipData.output.transactionShipments[0];
    const trackingNumber = transactionDetails.pieceResponses[0].trackingNumber;
    const base64Label = transactionDetails.pieceResponses[0].packageDocuments[0].url;

    console.log(`✅ Label Generated! Tracking: ${trackingNumber}`);

   // 👇 ADD THIS BLOCK: Save the label and tracking to the database forever
    if (orderId) {
      await db.collection("orders").doc(orderId).update({
        shippingStatus: "label_created",
        trackingNumber: trackingNumber,
        labelUrl: base64Label,
        shippedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      trackingNumber: trackingNumber,
      labelUrl: base64Label
    });

  } catch (error: any) {
    console.error("❌ Shipping API Exception:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
