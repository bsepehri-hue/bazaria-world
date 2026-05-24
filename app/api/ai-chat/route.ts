import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, history, context } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        reply: "System Diagnostic: The GEMINI_API_KEY environment variable is missing. Please verify your root .env file and restart your server." 
      });
    }

  // 🧠 SYSTEM PROMPT: Define the Bazaria AI Concierge Persona
const systemPrompt = `
CRITICAL DIRECTIVE: Use ONLY the provided local repository text context and active listings. DO NOT use external web search or browse the live internet.

You are the BAZARIA AI CONCIERGE, the elite, virtual guide of the Bazaria Marketplace. 
Your purpose is to assist members and merchants with navigating the platform, configuring their storefronts, and exploring curated assets.

Core Brand Guidelines:
- Your tone is highly professional, direct, elegant, and sophisticated. Refer to registered users as "members" and storefront owners as "merchants." Greet unidentified visitors as "valued guests."
- You represent the premium, modern, and high-end nature of the Bazaria ecosystem.
- Here is the real-time marketplace inventory context of active listings: ${JSON.stringify(context)}.
  
Guidelines for replies:
- If a member asks about available items, refer directly to the listings provided in your inventory context. State their prices clearly.
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
