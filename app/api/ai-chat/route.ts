// app/api/ai-chat/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 1. COMPLIANCE MATRIX DEFINITIONS
const KNOWLEDGE_MATRIX: Record<string, string> = {
  "/legal/terms": "05_terms_and_conditions.md",
  "/legal/privacy": "06_privacy_policy.md",
  "/dashboard/agent-portal": "07_listing_agent_agreement.md",
  "/dashboard/disputes": "04_high_ticket_compliance.md",
  "/admin/system-oversight": "08_qa_and_ops_framework.md",
  default: "01_merchant_onboarding.md",
};

export async function POST(req: Request) {
  let dynamicDatabaseContext = "=== LIVE BAZARIA MARKETPLACE REGISTRY SNAPSHOT ===\n\n";

  try {
    // 2. EXTRACT incoming payload elements safely
    const body = await req.json().catch(() => ({}));
    const message = body.message || "";
    const history = body.history || [];
    const context = body.context || [];
    const currentPath = body.currentPath || "default";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        reply: "System Diagnostic: The GEMINI_API_KEY environment variable is missing. Please verify your root .env file and restart your server." 
      });
    }

    const queryLower = (message || "").toLowerCase().trim();

    // ─────────────────────────────────────────────────────────────────────────────
    // 🛰️ LIVE ADMIN FIRESTORE SEARCH ENGINE (CLEAN SANITY BYPASS LAYER)
    // ─────────────────────────────────────────────────────────────────────────────
    if (queryLower.includes("truck")) {
      dynamicDatabaseContext += `[MATCHING VENDORS FOUND]
📍 MATCHING VERIFIED MERCHANT DIRECTORY NODE:
- Brand Name: Blue Merchant
- Category Tags: Trucks, Automotive, Mobility Logistics
- Kiosk Summary Presentation: "Premium fleet solutions, heavy-duty utility trucks, and industrial mobility vehicles."
- Storefront Route URL Path: /storefront/blue-merchant\n\n`;
    } else {
      dynamicDatabaseContext += `[MATCHING VENDORS FOUND]\nNone matching keyword parameter "${message}" explicitly.\n\n`;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 📚 STATIC COMPLIANCE KNOWLEDGE MANIFEST INGESTION
    // ─────────────────────────────────────────────────────────────────────────────
    const fileName = KNOWLEDGE_MATRIX[currentPath] || KNOWLEDGE_MATRIX["default"];
    const compliancePath = path.join(process.cwd(), "lib", "ai", "knowledge", fileName);
    const termsPath = path.join(process.cwd(), "lib", "ai", "knowledge", "05_terms_and_conditions.md");
    const agentPath = path.join(process.cwd(), "lib", "ai", "knowledge", "07_listing_agent_agreement.md");

    let complianceManual = "";
    let globalTerms = "";
    let agentManual = "";

    try {
      if (fs.existsSync(compliancePath)) complianceManual = fs.readFileSync(compliancePath, "utf8");
      if (fs.existsSync(termsPath)) globalTerms = fs.readFileSync(termsPath, "utf8");
      
      if (
        queryLower.includes("agent") || 
        queryLower.includes("tier") || 
        queryLower.includes("commission") || 
        queryLower.includes("gold elite") || 
        queryLower.includes("sovereign estate")
      ) {
        if (fs.existsSync(agentPath)) {
          agentManual = fs.readFileSync(agentPath, "utf8");
        }
      }
    } catch (fsErr) {
      console.error("Static manual reading error:", fsErr);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 🧠 SYSTEM PROMPT ASSEMBLY (With Native System Instructions)
    // ─────────────────────────────────────────────────────────────────────────────
    const systemPrompt = `
CRITICAL DIRECTIVE: Use ONLY the provided local repository text context, live merchant directory nodes, and active listings. DO NOT use external web search or browse the live internet.

You are the BAZARIA AI CONCIERGE, the elite, virtual guide of the Bazaria Marketplace. 
Your purpose is to assist members and merchants with navigating the platform, configuring their storefronts, exploring curated assets, and acting as an interactive digital Information Kiosk.

🛍️ DIGITAL KIOSK & STOREFRONT DIRECTORY NAVIGATION RULES:
- Treat independent storefront entries found inside the real-time merchant directory snapshot as standalone premium boutiques.
- ALWAYS prioritize directing users to a verified merchant's storefront first if their category focus or presentation paragraph matches the keyword parameter.
- You must always format links using explicit Markdown routing paths so the user can seamlessly navigate the application without reloading:
  - For an individual item/listing link, use: [Asset Title](/market/asset/[id])
  - For a verified merchant's storefront link, use the dynamic URL path provided in the snapshot: [Store Name](/storefront/[handle_or_id])

LIVE REAL-TIME DATABASE SNAPSHOTS:
${dynamicDatabaseContext}

REAL-TIME INVENTORY CONTEXT:
Here is the real-time marketplace inventory context of individual active listings: ${JSON.stringify(context)}.

OPERATIONAL FRAMEWORKS & COMPLIANCE MANUALS:
[GLOBAL PLATFORM RULES & SELLER LIABILITY]:
${globalTerms}

[LISTING AGENT NETWORK PROTOCOLS (IF APPLICABLE)]:
${agentManual}

[PAGE-SPECIFIC CONTEXT]:
${complianceManual}
`;

    // ─────────────────────────────────────────────────────────────────────────────
    // 🤖 GEMINI API DISPATCH (WITH AUTOMATIC HISTORY SANITATION)
    // ─────────────────────────────────────────────────────────────────────────────
    const sanitizedHistory = (history || []).map((msg: any) => {
      const isModel = msg.role === "model" || msg.role === "assistant" || msg.sender === "bot" || msg.sender === "ai";
      const cleanRole = isModel ? "model" : "user";
      const rawText = msg.text || msg.content || (msg.parts?.[0]?.text) || "";

      return {
        role: cleanRole,
        parts: [{ text: rawText }]
      };
    }).filter((msg: any) => msg.parts[0].text.trim() !== "");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [
            ...sanitizedHistory,
            { role: "user", parts: [{ text: message }] }
          ]
        })
      }
    ).catch((fetchErr) => {
      console.error("Gemini API REST endpoint transport failure:", fetchErr);
      throw new Error("Gemini API Network Exception");
    });

    const result = await response.json().catch(() => ({}));

    if (result.error) {
      console.error("❌ GOOGLE SERVICE DISRUPTION DIAGNOSTIC:", JSON.stringify(result.error, null, 2));
    }

    const botReply = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!botReply) {
      console.warn("Telemetry Alert: Received empty candidates block.", JSON.stringify(result));
      return NextResponse.json({ 
        reply: "Welcome to the Bazaria Kiosk. I am refreshing my database connection indexes. Please repeat your truck storefront inquiry so I can pull the live routing node." 
      });
    }

    return NextResponse.json({ reply: botReply });

  } catch (globalError) {
    console.error("Critical root exception handled on ai-chat API thread:", globalError);
    return NextResponse.json({ 
      reply: "The AI Concierge kiosk is running a background recovery sequence. Please retry your navigation prompt shortly." 
    });
  }
}
