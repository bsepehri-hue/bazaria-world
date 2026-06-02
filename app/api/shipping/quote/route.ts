import { NextResponse } from "next/server";

const FEDEX_API_KEY = process.env.FEDEX_API_KEY;
const FEDEX_SECRET_KEY = process.env.FEDEX_SECRET_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🎯 FORCE BACKEND ALIGNMENT ON THE 9-CHARACTER XID IDENTIFIER
    if (body && Array.isArray(body.items)) {
      body.items = body.items.map((item: any) => {
        const rawId = item.id || "JU4VA";
        // Ensure it converts "ju4va" or "JU4VA" directly into "XID-JU4VA"
        const standardizedLedgerID = rawId.toString().toUpperCase().startsWith("XID-")
          ? rawId.toString().toUpperCase().trim()
          : `XID-${rawId.toString().toUpperCase().trim()}`;
        
        return {
          ...item,
          id: standardizedLedgerID
        };
      });
    }

    // Now when this logs, it will display XID-JU4VA perfectly in your terminal!
    console.log("📥 Incoming Shipping Quote Payload:", body);

    // 🚀 SELF-HEALING DESTRUCTURING: Map loose variables or standard addresses interchangeably
    const targetZip = body?.toAddress?.zip || body?.shippingAddress?.zipCode || body?.address?.zipCode || body?.zipCode || "90210";
    const targetState = body?.toAddress?.state || body?.shippingAddress?.state || body?.address?.state || body?.state || "CA";

    // If API Keys are not ready yet, execute the sandbox simulator cleanly without crashing
    if (!FEDEX_API_KEY || !FEDEX_SECRET_KEY || FEDEX_API_KEY.includes("your_")) {
      console.log(`🛠️ Sandbox Simulator Mode Active for destination: ${targetZip}, ${targetState}`);
      
      const mockRates = [
        {
          serviceCode: "FEDEX_GROUND",
          serviceName: "FedEx Ground® (Simulated)",
          transitTime: "1-5 Business Days",
          baseRate: 14.95,
          convenienceFee: 5.00,
        },
        {
          serviceCode: "FEDEX_2_DAY",
          serviceName: "FedEx 2Day® (Simulated)",
          transitTime: "2 Business Days",
          baseRate: 32.50,
          convenienceFee: 5.00,
        }
      ];

      return NextResponse.json({
        success: true,
        rates: mockRates,
      });
    }

    // Live API integration tracking goes underneath here if keys are active...
    return NextResponse.json({ success: true, rates: [] });

  } catch (error: any) {
    console.error("❌ Shipping API Exception caught:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
