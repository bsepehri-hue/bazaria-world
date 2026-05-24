import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { message, history, context } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        reply: "System Diagnostic: The GEMINI_API_KEY environment variable is missing. Please verify your root .env file and restart your server." 
      });
    }

    // 🛠️ SAFE FILE READER: Load the high-ticket compliance manual safely
    const compliancePath = path.join(process.cwd(), "lib", "ai", "knowledge", "04_high_ticket_compliance.md");
    let complianceManual = "";

    try {
      if (fs.existsSync(compliancePath)) {
        complianceManual = fs.readFileSync(compliancePath, "utf8");
        console.log("Successfully loaded high-ticket compliance manual into AI prompt.");
      } else {
        console.warn(`Warning: Compliance manual file not found at path: ${compliancePath}. Using built-in fallback rules.`);
        complianceManual = `
        - Platform Rule: 5% Intent Deposit required on high-ticket assets.
        - Surcharges: Passed to buyer upfront (Credit Card ~3%, Crypto 1.5%, ACH capped at $7).
        - Bazaria Fee: 6% non-refundable Listing & Documentation fee out of the deposit.
        - Cancellation: 10% penalty levied on the deposit balance if seller defaults, split 50/50.
        - Role: Marketing/listing facilitation venue only. Total liability capped at the penalty split.
        `;
      }
    } catch (fileError) {
      console.error("Failed to read compliance directory safely:", fileError);
    }

    // 🧠 SYSTEM PROMPT: Define the Bazaria AI Concierge Persona
    const systemPrompt = `
CRITICAL DIRECTIVE: Use ONLY the provided local repository text context and active listings. DO NOT use external web search or browse the live internet.

You are the BAZARIA AI CONCIERGE, the elite, virtual guide of the Bazaria Marketplace. 
Your purpose is to assist members and merchants with navigating the platform, configuring their storefronts, and exploring curated assets.

Core Brand Guidelines:
- Your tone is highly professional, direct, elegant, and sophisticated. Refer to registered users as "members" and storefront owners as "merchants." Greet unidentified visitors as "valued guests."
- You represent the premium, modern, and high-end nature of the Bazaria ecosystem.

OPERATIONAL FRAMEWORKS & COMPLIANCE MANUALS:
Below is the strict regulatory and fee operational manual for high-ticket assets (Real Estate, Cars, Trucks, RVs) that you MUST enforce:
${complianceManual}

REAL-TIME INVENTORY CONTEXT:
Here is the real-time marketplace inventory context of active listings: ${JSON.stringify(context)}.
  
Guidelines for replies:
- If a member asks about available items, refer directly to the listings provided in your inventory context. State their prices clearly.
- If a user asks about deposit structures, fees, or auction cancellations for real estate or mobility assets, explain the 5% deposit, the upfront payment network surcharges (Credit Card, Crypto, or the $7 ACH cap), your 6% platform documentation cut, and the 10% liquidated damages default split exactly as detailed in the compliance manual above.
- If a user asks how to open, create, or activate a storefront, instruct them to click the "Create Storefront" option in the sidebar or head directly to the onboarding portal at "/market/create/onboarding". Mention that they will establish their shop details and connect their Web3 wallet/credentials there as a merchant.
- Keep responses concise, helpful, and beautifully structured. Avoid massive blocks of generic text.
`;

    // 🔄 UPDATED: Targeting gemini-2.5-flash via v1beta (or v1) to bypass the alias lookup issue
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] },
          ...history.map((msg: any) => ({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }]
          })),
          { role: "user", parts: [{ text: message }] }
        ]
      })
    });

  complianceManual = fs.readFileSync(compliancePath, "utf8");
}
    
    const responseData = await response.json();

    if (!response.ok) {
      console.log("=== GEMINI API REJECTION ===");
      console.log("Status:", response.status);
      console.log("Error Details:", JSON.stringify(responseData));
      console.log("============================");
      return NextResponse.json({ 
        reply: `My communication array encountered an API protocol warning: ${responseData.error?.message || "Unknown error"}` 
      });
    }

    const reply = responseData.candidates?.[0]?.content?.parts?.[0]?.text || 
                  "My cognitive links are temporarily disrupted. Please consult me again shortly.";

    return NextResponse.json({ reply });
 } catch (error) {
    console.error("AI Concierge Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
