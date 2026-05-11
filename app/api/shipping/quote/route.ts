import { NextResponse } from "next/server";

const UPS_CLIENT_ID = process.env.UPS_CLIENT_ID;
const UPS_CLIENT_SECRET = process.env.UPS_CLIENT_SECRET;
const UPS_SHIPPER_NUMBER = process.env.UPS_SHIPPER_NUMBER; 

// Auto-switch between sandbox (CIE) and production environments
const UPS_ENV = process.env.NODE_ENV === "production" ? "onlinetools" : "wwwcie"; 

const CONVENIENCE_FEE = 5.00;

// Mapping UPS internal service codes to human-readable names & average transit times
const UPS_SERVICES_MAP: Record<string, { name: string; transit: string }> = {
  "03": { name: "UPS Ground", transit: "1-5 Business Days" },
  "02": { name: "UPS 2nd Day Air", transit: "2 Business Days" },
  "01": { name: "UPS Next Day Air", transit: "Next Business Day" },
  "12": { name: "UPS 3 Day Select", transit: "3 Business Days" },
  "13": { name: "UPS Next Day Air Saver", transit: "Next Business Day (PM)" },
};

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
    throw new Error("Failed to authenticate with UPS API");
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const { fromAddress, toAddress, packageDetails, isOversized } = await req.json();

    // 1. Fetch our secure access token
    const token = await getUPSAccessToken();

    // 2. Build the UPS Rating Payload
    // By omitting the "Service" block from the shipment request, 
    // the UPS "/shop" API returns ALL available shipping options for this route!
    const upsRatingPayload = {
      RateRequest: {
        Request: {
          TransactionReference: {
            CustomerContext: "Bazaria Multi-Rate Quote Request",
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
          Package: {
            PackagingType: {
              Code: "02", // Customer Supplied Package (Standard cardboard box)
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

    // 3. Dispatch the "shop" query directly to the UPS Rating Endpoint
    const upsResponse = await fetch(`https://${UPS_ENV}.ups.com/api/rating/v1/shop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        transId: crypto.randomUUID().replace(/-/g, ""), // 32-character transaction ID
        transactionSrc: "Bazaria_App",
      },
      body: JSON.stringify(upsRatingPayload),
    });

    const data = await upsResponse.json();

    if (!upsResponse.ok) {
      console.error("UPS Rating Shop API Error Details:", data);
      return NextResponse.json({ error: "UPS Rating error", details: data }, { status: 400 });
    }

    // 4. Parse the array of returned rates
    const ratedShipments = data.RateResponse?.RatedShipment;
    
    if (!ratedShipments || !Array.isArray(ratedShipments)) {
      return NextResponse.json({ error: "No shipping methods returned from UPS." }, { status: 404 });
    }

    // Map through the UPS response, filter for services we want to offer, and add our Convenience Fee
    const compiledRates = ratedShipments
      .map((shipment: any) => {
        const serviceCode = shipment.Service.Code;
        const matchingService = UPS_SERVICES_MAP[serviceCode];

        // Skip services we don't map/support
        if (!matchingService) return null;

        // Skip express air options if package is flagged as oversized
        if (isOversized && serviceCode !== "03") return null;

        const baseRate = parseFloat(shipment.TotalCharges.MonetaryValue);

        return {
          serviceCode,
          serviceName: matchingService.name,
          transitTime: matchingService.transit,
          baseRate: baseRate,
          convenienceFee: CONVENIENCE_FEE,
        };
      })
      .filter(Boolean) // Filter out the null values
      .sort((a, b) => (a?.baseRate || 0) - (b?.baseRate || 0)); // Sort cheapest to most expensive

    return NextResponse.json({
      success: true,
      rates: compiledRates,
    });

  } catch (error: any) {
    console.error("Multi-Rate Shipping API Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
