import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin"; // 👈 Your exact working import

const FEDEX_API_KEY = process.env.FEDEX_API_KEY;
const FEDEX_SECRET_KEY = process.env.FEDEX_SECRET_KEY;
const FEDEX_ACCOUNT_NUMBER = process.env.FEDEX_ACCOUNT_NUMBER;

// 🧠 IN-MEMORY TOKEN CACHE
let cachedToken: string | null = null;
let tokenExpiryTime: number = 0;

async function getFedexToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiryTime) {
    return cachedToken;
  }

  const authUrl = "https://apis.fedex.com/oauth/token";
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

  if (!response.ok) {
    throw new Error("Failed to authenticate with FedEx API");
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiryTime = now + ((data.expires_in || 3600) - 60) * 1000;
  
  return cachedToken;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    let itemsToProcess = body.items || [];
    if (Array.isArray(itemsToProcess)) {
      itemsToProcess = itemsToProcess.map((item: any) => {
        const rawId = item.id || "JU4VA";
        const pureDatabaseID = rawId.toString().replace(/^XID-/i, '').toUpperCase().trim();
        return { ...item, id: pureDatabaseID };
      });
    }

    const targetZip = body?.toAddress?.zip || body?.shippingAddress?.zipCode || body?.address?.zipCode || body?.zipCode;
    const targetState = body?.toAddress?.state || body?.shippingAddress?.state || body?.address?.state || body?.state;

    if (!targetZip || !targetState) {
      return NextResponse.json({ error: "Missing destination address" }, { status: 400 });
    }

    const token = await getFedexToken();

    // 2. 🛡️ THE BULLETPROOF FIX: Server-Side Firestore Lookup
    const packageLineItems = await Promise.all(itemsToProcess.map(async (item: any) => {
      let dbLogistics: any = null;

      try {
        // Intercept the ID and pull the exact logistics profile from Firestore directly
        const assetDoc = await adminDb.collection("listings").doc(item.id).get();
        if (assetDoc.exists) {
          dbLogistics = assetDoc.data()?.logistics;
        }
      } catch (err) {
        console.warn("Silent DB lookup skipped for item:", item.id);
      }

      // Merge: Firestore Truth > Frontend Cart > Fallback
      const safeLogistics = dbLogistics || item.logistics || {};

      return {
        groupPackageCount: 1,
        weight: {
          units: "LB",
          value: safeLogistics.weight || item.weight || 10 
        },
        dimensions: {
          length: safeLogistics.length || item.length || 12,
          width: safeLogistics.width || item.width || 12,
          height: safeLogistics.height || item.height || 12,
          units: "IN"
        }
      };
    }));

    // 🔍 THE SECRET TRACKER
    console.log("🔍 SECURE FEDEX PAYLOAD:", JSON.stringify(packageLineItems, null, 2));

    // 3. Call FedEx Rates API
   const rateResponse = await fetch("https://apis.fedex.com/rate/v1/rates/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        accountNumber: { value: FEDEX_ACCOUNT_NUMBER },
        requestedShipment: {
          shipper: {
            address: { postalCode: "92626", countryCode: "US" }
          },
          recipient: {
            address: { postalCode: targetZip, countryCode: "US" }
          },
          pickupType: "DROPOFF_AT_FEDEX_LOCATION",
          rateRequestType: ["LIST"],
          requestedPackageLineItems: packageLineItems
        }
      })
    });

    const rateData = await rateResponse.json();

    if (!rateResponse.ok) {
      console.error("FedEx API Error:", rateData);
      throw new Error(rateData?.errors?.[0]?.message || "Failed to fetch FedEx rates");
    }

    const rateDetails = rateData?.output?.rateReplyDetails;
    if (!rateDetails || rateDetails.length === 0) {
      throw new Error("No shipping rates returned for this route");
    }

   // 4. Filter for our specific allowed service tiers
    const allowedServices = ["FEDEX_GROUND", "FEDEX_2_DAY", "STANDARD_OVERNIGHT"];
    
    const availableRates = rateDetails
      .filter((r: any) => allowedServices.includes(r.serviceType))
      .map((r: any) => {
        const chargeObject = r.ratedShipmentDetails[0].totalNetCharge || r.ratedShipmentDetails[0].totalBaseCharge;
        const amount = typeof chargeObject === 'object' ? chargeObject.amount : chargeObject;
        
        return {
          serviceName: r.serviceType,
          rate: amount
        };
      });

    if (availableRates.length === 0) {
      throw new Error("No supported shipping rates returned for this destination");
    }

    // 5. Return the array of options to the frontend
    return NextResponse.json({
      success: true,
      rates: availableRates // 👈 This is now an array of options!
    });

  } catch (error: any) {
    console.error("❌ Shipping API Exception caught:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
