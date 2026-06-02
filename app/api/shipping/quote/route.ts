import { NextResponse } from "next/server";

const FEDEX_API_KEY = process.env.FEDEX_API_KEY;
const FEDEX_SECRET_KEY = process.env.FEDEX_SECRET_KEY;
const FEDEX_ACCOUNT_NUMBER = process.env.FEDEX_ACCOUNT_NUMBER;

const FEDEX_BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://apis.fedex.com" 
  : "https://apis-sandbox.fedex.com";

const CONVENIENCE_FEE = 5.00;

const FEDEX_SERVICES_MAP: Record<string, string> = {
  "FEDEX_GROUND": "FedEx Ground®",
  "FEDEX_2_DAY": "FedEx 2Day®",
  "STANDARD_OVERNIGHT": "FedEx Standard Overnight®",
  "PRIORITY_OVERNIGHT": "FedEx Priority Overnight®",
};

async function getFedExAccessToken() {
  if (!FEDEX_API_KEY || !FEDEX_SECRET_KEY) {
    throw new Error("Missing FedEx credentials.");
  }

  const response = await fetch(`${FEDEX_BASE_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: FEDEX_API_KEY,
      client_secret: FEDEX_SECRET_KEY,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate with FedEx API");
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const { fromAddress, toAddress, packageDetails } = await req.json();

    // 🚀 SANDBOX MODE DETECTION: If keys aren't set, intercept and return real-looking mock rates!
    if (!FEDEX_API_KEY || !FEDEX_SECRET_KEY || FEDEX_API_KEY.includes("your_")) {
      console.log("🛠️ FEDEX API KEYS MISSING: Activating local sandbox simulator mode...");
      
      // Calculate a pseudo-realistic cost based on item weight or distance factors
      const packageWeight = packageDetails?.weight || 2;
      const computedBase = 12.50 + (packageWeight * 1.25);

      const mockRates = [
        {
          serviceCode: "FEDEX_GROUND",
          serviceName: "FedEx Ground® (Simulated)",
          transitTime: "1-5 Business Days",
          baseRate: computedBase,
          convenienceFee: CONVENIENCE_FEE,
        },
        {
          serviceCode: "FEDEX_2_DAY",
          serviceName: "FedEx 2Day® (Simulated)",
          transitTime: "2 Business Days",
          baseRate: computedBase + 18.00,
          convenienceFee: CONVENIENCE_FEE,
        }
      ];

      return NextResponse.json({
        success: true,
        rates: mockRates,
      });
    }

    // 🔐 LIVE PRODUCTION FLOW (Will execute seamlessly once keys are provided)
    const token = await getFedExAccessToken();

    const fedexRatingPayload = {
      accountNumber: { value: FEDEX_ACCOUNT_NUMBER || "" },
      requestedShipment: {
        shipper: {
          address: {
            streetLines: [fromAddress.street],
            city: fromAddress.city,
            stateOrProvinceCode: fromAddress.state,
            postalCode: fromAddress.zip,
            countryCode: fromAddress.country || "US",
          },
        },
        recipient: {
          address: {
            streetLines: [toAddress.street],
            city: toAddress.city,
            stateOrProvinceCode: toAddress.state,
            postalCode: toAddress.zip,
            countryCode: toAddress.country || "US",
          },
        },
        pickupType: "DROPOFF_AT_FEDEX_LOCATION",
        rateRequestType: ["ACCOUNT", "LIST"],
        requestedPackageLineItems: [
          {
            weight: { units: "LB", value: packageDetails.weight || 1 },
            dimensions: {
              length: packageDetails.length || 12,
              width: packageDetails.width || 10,
              height: packageDetails.height || 6,
              units: "IN",
            },
          },
        ],
      },
    };

    const fedexResponse = await fetch(`${FEDEX_BASE_URL}/rate/v1/rates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(fedexRatingPayload),
    });

    const data = await fedexResponse.json();

    if (!fedexResponse.ok) {
      console.error("FedEx Rating API Error Details:", data);
      return NextResponse.json({ error: "FedEx Rating API exception occurred.", details: data }, { status: 400 });
    }

    const rateReplyDetails = data.output?.rateReplyDetails;
    if (!rateReplyDetails || !Array.isArray(rateReplyDetails)) {
      return NextResponse.json({ error: "No shipping rates generated." }, { status: 404 });
    }

    const compiledRates = rateReplyDetails
      .map((rateOption: any) => {
        const serviceType = rateOption.serviceType;
        const cleanName = FEDEX_SERVICES_MAP[serviceType];
        if (!cleanName) return null;

        const totalNetCharge = rateOption.ratedShipmentDetails?.[0]?.totalNetCharge || 0;

        return {
          serviceCode: serviceType,
          serviceName: cleanName,
          transitTime: "Calculated at fulfillment",
          baseRate: parseFloat(totalNetCharge) || 0,
          convenienceFee: CONVENIENCE_FEE,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (a?.baseRate || 0) - (b?.baseRate || 0));

    return NextResponse.json({
      success: true,
      rates: compiledRates,
    });

  } catch (error: any) {
    console.error("Multi-Rate FedEx Shipping API Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
