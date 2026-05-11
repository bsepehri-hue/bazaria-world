import { NextResponse } from "next/server";

// UPS Configuration (Make sure these are added to your local .env)
const UPS_CLIENT_ID = process.env.UPS_CLIENT_ID;
const UPS_CLIENT_SECRET = process.env.UPS_CLIENT_SECRET;
const UPS_SHIPPER_NUMBER = process.env.UPS_SHIPPER_NUMBER; // Your 6-character UPS account number

// Automatically switch between the UPS Sandbox (CIE) and Production environment
const UPS_ENV = process.env.NODE_ENV === "production" ? "onlinetools" : "wwwcie"; 

const CONVENIENCE_FEE = 5.00;

// 🔐 Helper to fetch a fresh OAuth2 access token from UPS
async function getUPSAccessToken() {
  if (!UPS_CLIENT_ID || !UPS_CLIENT_SECRET) {
    throw new Error("Missing UPS credentials in environment variables.");
  }

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
    console.error("UPS Auth Error response:", errText);
    throw new Error("Failed to authenticate with UPS API");
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const { fromAddress, toAddress, packageDetails } = await req.json();

    // 1. Get our secure OAuth bearer token
    const token = await getUPSAccessToken();

    // 2. Format the payload exactly how the UPS Rating API expects it
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
            Code: "03", // "03" is standard UPS Ground.
            Description: "Ground",
          },
          Package: {
            PackagingType: {
              Code: "02", // "02" is Customer Supplied Package (regular boxes)
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

    // 3. Request rate quote from the official UPS Rating Service
    const upsResponse = await fetch(`https://${UPS_ENV}.ups.com/api/rating/v1/shop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        transId: crypto.randomUUID().replace(/-/g, ""), // Clean unique transaction ID
        transactionSrc: "Bazaria_App",
      },
      body: JSON.stringify(upsRatingPayload),
    });

    const data = await upsResponse.json();

    if (!upsResponse.ok) {
      return NextResponse.json({ error: "UPS Rating error", details: data }, { status: 400 });
    }

    // 4. Extract the base rate and calculate the total charge + our $5 convenience fee
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
