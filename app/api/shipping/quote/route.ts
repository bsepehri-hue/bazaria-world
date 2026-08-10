  import { NextResponse } from "next/server";

const FEDEX_API_KEY = process.env.FEDEX_API_KEY;
const FEDEX_SECRET_KEY = process.env.FEDEX_SECRET_KEY;
const FEDEX_ACCOUNT_NUMBER = process.env.FEDEX_ACCOUNT_NUMBER;

// 🔐 HELPER: Fetch secure OAuth token from FedEx Sandbox
async function getFedexToken() {
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
  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🎯 FORCE BACKEND ALIGNMENT ON THE RAW DATABASE IDENTIFIER
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

    console.log(`🚀 Requesting LIVE Sandbox Quote for: ${targetState} ${targetZip}`);

    // 1. Get Authentication Token
    const token = await getFedexToken();

    // 2. 📦 DYNAMIC DIMENSIONAL WEIGHT MAPPING
    // Maps your cart items. If an item doesn't have weight/dimensions saved yet, defaults to a standard 12x12x12 10lb box.
    const packageLineItems = body.items.map((item: any) => ({
      groupPackageCount: 1,
      weight: {
        units: "LB",
        value: item.weight || 10 
      },
      dimensions: {
        length: item.length || 12,
        width: item.width || 12,
        height: item.height || 12,
        units: "IN"
      }
    }));

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
              postalCode: "92626", // 👈 Default Origin Zip (Costa Mesa HQ) - we will make this dynamic per-seller later!
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

    // 4. Extract the FedEx Ground rate
    const rateDetails = rateData?.output?.rateReplyDetails;
    if (!rateDetails || rateDetails.length === 0) {
      throw new Error("No shipping rates returned for this route");
    }

    // Isolate Ground shipping, or fallback to the first returned option
    const preferredRate = rateDetails.find((r: any) => r.serviceType === "FEDEX_GROUND") || rateDetails[0];
    
    // Drill into FedEx's nested JSON array to grab the final dollar amount
   // 🎯 FIXED: Drill into the currency object to grab the raw dollar amount
    const chargeObject = preferredRate.ratedShipmentDetails[0].totalNetCharge || preferredRate.ratedShipmentDetails[0].totalBaseCharge;
    const netCharge = typeof chargeObject === 'object' ? chargeObject.amount : chargeObject;

    console.log(`✅ Live FedEx Quote Successful: $${netCharge}`);

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
