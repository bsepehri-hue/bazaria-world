import { NextResponse } from "next/server";

// UPS Configuration (Pulls from your secure, gitignored root .env)
const UPS_CLIENT_ID = process.env.UPS_CLIENT_ID;
const UPS_CLIENT_SECRET = process.env.UPS_CLIENT_SECRET;
const UPS_SHIPPER_NUMBER = process.env.UPS_SHIPPER_NUMBER; 

// Automatically targets sandbox (CIE) during local development and production servers when deployed
const UPS_ENV = process.env.NODE_ENV === "production" ? "onlinetools" : "wwwcie"; 

const CONVENIENCE_FEE = 5.00;

// 🔐 Helper function to grab a fresh, short-lived OAuth2 access token from UPS
async function getUPSAccessToken() {
  if (!UPS_CLIENT_ID || !UPS_CLIENT_SECRET) {
    throw new Error("Missing UPS credentials in .env file.");
  }

  // Base64 encode the client ID and secret for Basic Auth handshake
  const auth = Buffer.from(`${UPS_CLIENT_ID}:${UPS_CLIENT_SECRET}`).toString("base64");
  
  const response = await fetch(`https://${UPS_ENV}.ups.com/security/v1/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("UPS OAuth2 Handshake Failed:", errText);
    throw new Error("Failed to authenticate with UPS API");
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const { fromAddress, toAddress, packageDetails } = await req.json();

    // 1. Fetch our secure access token
    const token = await getUPSAccessToken();

    // 2. Format the payload to match UPS Rating API constraints exactly
    const upsRatingPayload = {
      RateRequest: {
        Request: {
          TransactionReference: {
            CustomerContext: "Bazaria Live Quote Request",
          },
        },
        Shipment: {
          Shipper: {
            Name: "Bazaria Merchant",
            ShipperNumber: UPS_SHIPPER_NUMBER || "",
            Address: {
              AddressLine: [fromAddress.street],
              City: fromAddress.city,
              StateProvinceCode: fromAddress.state,
              PostalCode: fromAddress.zip,
              CountryCode: fromAddress.country || "US",
            },
          },
          ShipTo: {
            Name: toAddress.name || "Recipient",
            Address: {
              AddressLine: [toAddress.street],
              City: toAddress.city,
              StateProvinceCode: toAddress.state,
              PostalCode: toAddress.zip,
              CountryCode: toAddress.country || "US",
            },
          },
          ShipFrom: {
            Name: "Merchant Storefront",
            Address: {
              AddressLine: [fromAddress.street],
              City: fromAddress.city,
              StateProvinceCode: fromAddress.state,
              PostalCode: fromAddress.zip,
              CountryCode: fromAddress.country || "US",
            },
          },
          Service: {
            Code: "03", // Ground Shipping service code
            Description: "Ground",
          },
          Package: {
            PackagingType: {
              Code: "02", // Customer Supplied Box
              Description: "Box",
            },
            Dimensions: {
              UnitOfMeasurement: {
                Code: "IN",
                Description: "Inches",
              },
              Length: String(packageDetails.length),
              Width: String(packageDetails.width),
              Height: String(packageDetails.height),
            },
            PackageWeight: {
              UnitOfMeasurement: {
                Code: "LBS",
                Description: "Pounds",
              },
              Weight: String(packageDetails.weight),
            },
          },
        },
      },
    };

    // 3. Dispatch the rate calculation request directly to UPS
    const upsResponse = await fetch(`https://${UPS_ENV}.ups.com/api/rating/v1/shop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        transId: crypto.randomUUID().replace(/-/g, ""), // Generates the required clean 32-character transaction ID
        transactionSrc: "Bazaria_App",
      },
      body: JSON.stringify(upsRatingPayload),
    });

    const data = await upsResponse.json();

    if (!upsResponse.ok) {
      console.error("UPS Rating Error Details:", data);
      return NextResponse.json({ error: "UPS Rating error", details: data }, { status: 400 });
    }

    // 4. Extract base rate from the payload and compute total + our convenience fee
    const baseRate = parseFloat(
      data.RateResponse.RatedShipment.TotalCharges.MonetaryValue
    );
    const finalCustomerQuote = baseRate + CONVENIENCE_FEE;

    return NextResponse.json({
      success: true,
      baseRate: baseRate,
      convenienceFee: CONVENIENCE_FEE,
      finalQuote: finalCustomerQuote,
    });

  } catch (error: any) {
    console.error("Shipping Rate API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
