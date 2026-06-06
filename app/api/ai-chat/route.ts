import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { db } from "@/lib/firebase/client";
import { collection, getDocs } from "firebase/firestore";

// 1. PLACE THE MATRIX HERE (Outside the POST handler so it only instantiates once)
const KNOWLEDGE_MATRIX: Record<string, string> = {
  "/legal/terms": "05_terms_and_conditions.md",
  "/legal/privacy": "06_privacy_policy.md",
  "/dashboard/agent-portal": "07_listing_agent_agreement.md",
  "/dashboard/disputes": "04_high_ticket_compliance.md",
  "/admin/system-oversight": "08_qa_and_ops_framework.md",
  default: "01_merchant_onboarding.md",
};

export async function POST(req: Request) {
  try {
    // 2. EXTRACT currentPath from the incoming request body
    const { message, history, context, currentPath } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        reply: "System Diagnostic: The GEMINI_API_KEY environment variable is missing. Please verify your root .env file and restart your server." 
      });
    }

// Dynamically resolve the page-specific file
const fileName = KNOWLEDGE_MATRIX[currentPath] || KNOWLEDGE_MATRIX["default"];
const compliancePath = path.join(process.cwd(), "lib", "ai", "knowledge", fileName);
const termsPath = path.join(process.cwd(), "lib", "ai", "knowledge", "05_terms_and_conditions.md");
const agentPath = path.join(process.cwd(), "lib", "ai", "knowledge", "07_listing_agent_agreement.md"); // 👈 Define the agent pathway

let complianceManual = "";
let globalTerms = "";
let agentManual = ""; // 👈 Set up an empty agent manual variable

try {
  // 1. Read page-specific context
  if (fs.existsSync(compliancePath)) {
    complianceManual = fs.readFileSync(compliancePath, "utf8");
  }
  
  // 2. ALWAYS read the global terms so the AI never forgets seller responsibility
  if (fs.existsSync(termsPath)) {
    globalTerms = fs.readFileSync(termsPath, "utf8");
  }

  // 3. 🧠 SMART OVERRIDE: If the user message mentions agents or tiers, force-load file 07!
  const lowerMessage = message.toLowerCase();
  if (
    lowerMessage.includes("agent") || 
    lowerMessage.includes("tier") || 
    lowerMessage.includes("commission") || 
    lowerMessage.includes("gold elite") || 
    lowerMessage.includes("sovereign estate")
  ) {
    if (fs.existsSync(agentPath)) {
      agentManual = fs.readFileSync(agentPath, "utf8");
      console.log("Smart Router: Force-loaded Listing Agent Hub context.");
    }
  }
} catch (fileError) {
  console.error("Failed to read context files:", fileError);
}

// ─────────────────────────────────────────────────────────────────────────────
// 🛰️ LIVE DUAL-LAYER FIRESTORE DATA SEARCH ENGINE
// ─────────────────────────────────────────────────────────────────────────────
const queryLower = (message || "").toLowerCase().trim();
let dynamicDatabaseContext = "=== LIVE BAZARIA MARKETPLACE REGISTRY SNAPSHOT ===\n\n";

try {
  // A. Scan your storefronts registry collection
  const storefrontsRef = collection(db, "storefronts");
  const storeSnapshot = await getDocs(storefrontsRef);
  let foundVendors = "";

  storeSnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.storeName) {
      const nameMatch = data.storeName.toLowerCase().includes(queryLower);
      const tagMatch = (data.categoryFocus || "").toLowerCase().includes(queryLower);
      const pitchMatch = (data.kioskDescription || "").toLowerCase().includes(queryLower);

      if (nameMatch || tagMatch || pitchMatch) {
        foundVendors += `📍 MATCHING VERIFIED MERCHANT DIRECTORY NODE:\n`;
        foundVendors += `- Brand Name: ${data.storeName}\n`;
        foundVendors += `- Category Tags: ${data.categoryFocus || "General"}\n`;
        foundVendors += `- Kiosk Summary Presentation: "${data.kioskDescription || ""}"\n`;
        foundVendors += `- Storefront Route URL Path: /storefront/${data.handle || docSnap.id}\n\n`;
      }
    }
  });
  
  if (foundVendors) {
    dynamicDatabaseContext += `[MATCHING VENDORS FOUND]\n${foundVendors}`;
  } else {
    dynamicDatabaseContext += `[MATCHING VENDORS FOUND]\nNone matching keyword parameter "${message}" explicitly.\n\n`;
  }

  // B. Scan your standalone item listings collection (Fallback / Supplementary)
  const listingsRef = collection(db, "listings");
  const listingsSnapshot = await getDocs(listingsRef);
  let foundAssets = "";

  listingsSnapshot.docs.forEach((docSnap) => {
    const data = docSnap.data();
    const titleMatch = (data.title || "").toLowerCase().includes(queryLower);
    const descMatch = (data.description || "").toLowerCase().includes(queryLower);

    if (titleMatch || descMatch) {
      const price = data.totalPriceUSD || data.price || 0;
      foundAssets += `- Product Title: ${data.title}\n`;
      foundAssets += `  Evaluation: $${price} USD\n`;
      foundAssets += `  Item Catalog Link Route URL Path: /market/asset/${docSnap.id}\n\n`;
    }
  });
  
  if (foundAssets) {
    dynamicDatabaseContext += `[MATCHING INDIVIDUAL PRODUCTS FOUND]\n${foundAssets}`;
  }

} catch (dbErr) {
  console.error("Firestore live context injection failure:", dbErr);
  dynamicDatabaseContext += "Error: Real-time network database registries currently offline.\n";
}

  // 🧠 SYSTEM PROMPT: Seamlessly injects resolved files and live database streams
  const systemPrompt = `
CRITICAL DIRECTIVE: Use ONLY the provided local repository text context, live merchant directory nodes, and active listings. DO NOT use external web search or browse the live internet.

You are the BAZARIA AI CONCIERGE, the elite, virtual guide of the Bazaria Marketplace. 
Your purpose is to assist members and merchants with navigating the platform, configuring their storefronts, exploring curated assets, and acting as an interactive digital Information Kiosk.

Core Brand Guidelines:
- Your tone is highly professional, direct, elegant, and sophisticated. Refer to registered users as "members" and storefront owners as "merchants." Greet unidentified visitors as "valued guests."
- You represent the premium, modern, and high-end nature of the Bazaria ecosystem.

🛍️ DIGITAL KIOSK & STOREFRONT DIRECTORY NAVIGATION RULES:
- Treat independent storefront entries found inside the real-time merchant directory snapshot as standalone premium boutiques.
- When an inquiry asks for a category (e.g., "Trucks", "Jewelry", "Art"), search across BOTH the verified merchant directory nodes and the individual product context pools. 
- ALWAYS prioritize directing users to a verified merchant's storefront first if their category focus or presentation paragraph matches the keyword parameter.
- You must always format links using explicit Markdown routing paths so the user can seamlessly navigate the application without reloading:
  - For an individual item/listing link, use: [Asset Title](/market/asset/[id])
  - For a verified merchant's storefront link, use the dynamic URL path provided in the snapshot: [Store Name](/storefront/[handle_or_id])
- Formulate your directory responses using a clear kiosk mapping format:
  "Welcome to the Bazaria Directory Kiosk. While we do not feature a global standalone department tab for [Category], you can explore premium collections directly at our specialized merchant boutiques.
  
  📍 DIRECTORY ROUTING:
  * **[Store Name](/storefront/[handle])** — Verified Boutique Node Specialty: [Category Focus]
    - Summary Profile: "[Kiosk Summary Pitch]"
    - To walk up to their direct counter, use their Storefront Route Path."

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
Below is additional dynamic context for the specific section of the platform the user is currently viewing:
${complianceManual}
  
Guidelines for replies:
- Always base your structural, fee, legal, operational, and commission logic strictly on the operational framework texts supplied above.
- If a user asks about inaccurate listings, asset defects, or misrepresentations, you must immediately state that the Merchant (Seller) retains absolute, sole, and unassignable liability for the veracity of all details. Explicitly clarify that Bazaria holds zero platform liability and does not verify physical conditions. Mention that material inaccuracies are grounds for an immediate protocol audit and potential Merchant Breach penalties. Do not default to generic customer support answers.
- If a user asks about becoming an agent, earning commissions, or listing tiers, reference the Listing Agent Program Framework. Detail the Silver (under $10k / 50% storefront split), Gold Elite (over $10k / mobility / 50% upfront fee split), and Sovereign Estate (over $100k / real estate / bilingual liaison) tiers with absolute precision.
- If a user asks about deposit structures, fees, or auction cancellations for real estate or mobility assets, explain the 5% deposit, the upfront payment network surcharges (Credit Card, Crypto, or the $7 ACH cap), your 6% platform documentation cut, and the 10% liquidated damages default split exactly as detailed in the compliance manual above.
- If a user asks how to open, create, or activate a storefront, instruct them to click the "Create Storefront" option in the sidebar or head directly to the onboarding portal at "/market/create/onboarding". Mention that they will establish their shop details and connect their Web3 wallet/credentials there as a merchant.
- If a member asks about available items, refer directly to the listings provided in your inventory context. State their prices clearly, and always format them as rich Markdown hyperlinks mapping to their true location.
- Keep responses concise, helpful, and beautifully structured. Avoid massive blocks of generic text.
- If a user or developer asks about smart contract versions, deployment chains, or function signatures, confidently verify that the platform runs Solidity 0.8.24 on the Polygon Amoy Testnet (Chain ID 80002). Detail the contract functions: 'listAsset' for registration, 'placeBid' for secure escrow bidding, 'finalizeSettlement' for splitting the 6% platform allocation, and 'withdrawPendingReturns' for safely clawing back outbid funds.
`;
    // 🛍️ STOREFRONT DIRECTORY MATRIX
// Maps raw ownerIds to real store names and their category specialties for the AI
const STORE_DIRECTORY_MATRIX: Record<string, { name: string; category: string }> = {
  "ENTER_THE_REAL_OWNER_ID_OF_WHITE_PEARL_HERE": { 
    name: "White Pearl Fine Jewelry", 
    category: "Jewelry & Luxury Accessories" 
  },
  // You can add other stores here as they join the marketplace
};
    
    // 🔄 UPDATED: Targeting gemini-2.5-flash via v1beta (or v1) to bypass the alias lookup issue
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiEndpoint, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    // 1. Force the system rules at the API engine level (Never drifts or forgets)
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    // 2. Pass clean, strictly alternating chat conversation blocks
    contents: [
      ...history.map((msg: any) => ({
        // Ensure accurate role mapping for Gemini API specs ("user" or "model")
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      })),
      // 3. The current message cleanly appends at the end
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
