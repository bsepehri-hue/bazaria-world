import { NextResponse } from "next/server";

const FEDEX_API_KEY = process.env.FEDEX_API_KEY;
const FEDEX_SECRET_KEY = process.env.FEDEX_SECRET_KEY;
const FEDEX_ACCOUNT_NUMBER = process.env.FEDEX_ACCOUNT_NUMBER;

// 🧠 IN-MEMORY TOKEN CACHE (Prevents requesting a new token on every zip change)
let cachedToken: string | null = null;
let tokenExpiryTime: number = 0;

async function getFedexToken() {
  const now = Date.now();
  
  // If we already have a valid token that hasn't expired, reuse it!
  if (cachedToken && now < tokenExpiryTime) {
    return cachedToken;
  }

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

  if (!response.ok) {
    throw new Error("Failed to authenticate with FedEx API");
  }

  const data = await response.json();
  
  // Save the token and set expiration 1 minute before the official 1-hour expiry
  cachedToken = data.access_token;
  tokenExpiryTime = now + ((data.expires_in || 3600) - 60) * 1000;
  
  return cachedToken;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body && Array.isArray(body.items)) {
      body.items = body.items.map((item: any) => {
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

    // 1. Get Cached Token (Instant on 2nd request)
    const token = await getFedexToken();

   // 2. 📦 DYNAMIC DIMENSIONAL WEIGHT MAPPING
    const packageLineItems = body.items.map((item: any) => {
      // Safely extract the nested logistics object we injected during asset creation
      const logistics = item.logistics || {};

      return {
        groupPackageCount: 1,
        weight: {
          units: "LB",
          // 👇 Now pulls the actual 200lb weight from your preset!
          value: logistics.weight || item.weight || 10 
        },
        dimensions: {
          // 👇 Now pulls the massive 48x48x48 dimensions from your preset!
          length: logistics.length || item.length || 12,
          width: logistics.width || item.width || 12,
          height: logistics.height || item.height || 12,
          units: "IN"
        }
      };
    });
    // 3. Call FedEx Rates API
    const rateResponse = await fetch("https://apis-sandbox.fedex.com/rate/v1/rates/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        accountNumber: {
          value: FEDEX_ACCOUNT_NUMBER
        },
        requestedShipment: {
          shipper: {
            address: {
              postalCode: "92626", 
              countryCode: "US"
            }
          },
          recipient: {
            address: {
              postalCode: targetZip,
              countryCode: "US"
            }
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

    const preferredRate = rateDetails.find((r: any) => r.serviceType === "FEDEX_GROUND") || rateDetails[0];
    
    const chargeObject = preferredRate.ratedShipmentDetails[0].totalNetCharge || preferredRate.ratedShipmentDetails[0].totalBaseCharge;
    const netCharge = typeof chargeObject === 'object' ? chargeObject.amount : chargeObject;

    return NextResponse.json({
      success: true,
      rate: netCharge, 
      serviceName: preferredRate.serviceType
    });

  } catch (error: any) {
    console.error("❌ Shipping API Exception caught:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
