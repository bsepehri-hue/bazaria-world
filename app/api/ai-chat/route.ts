// app/api/ai-chat/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { adminDb } from "@/lib/firebase/admin";

// --- Keep your KNOWLEDGE_MATRIX definitions here ---

export async function POST(req: Request) {
  // Declare dynamicDatabaseContext up top so it is always accessible to the systemPrompt
  let dynamicDatabaseContext = "=== LIVE BAZARIA MARKETPLACE REGISTRY SNAPSHOT ===\n\n";

  try {
    // 1. EXTRACT incoming request body elements safely
    const body = await req.json().catch(() => ({}));
    const message = body.message || "";
    const currentPath = body.currentPath || "default";
    const context = body.context || [];

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        reply: "System Diagnostic: The GEMINI_API_KEY environment variable is missing. Please verify your root .env file and restart your server." 
      });
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 🛰️ LIVE ADMIN FIRESTORE SCANNER (FULLY ACCIDENT-PROOF)
    // ─────────────────────────────────────────────────────────────────────────────
    const queryLower = message.toLowerCase().trim();

    if (queryLower) {
      try {
        // A. Scan Storefronts Collection
        const storeSnapshot = await adminDb.collection("storefronts").get().catch((err) => {
          console.error("Storefronts collection read failure:", err);
          return null;
        });

        let foundVendors = "";
        if (storeSnapshot && storeSnapshot.docs) {
          storeSnapshot.docs.forEach((docSnap) => {
            const data = docSnap.data() || {};
            const storeName = data.storeName || "";
            const categoryFocus = data.categoryFocus || "";
            const kioskDescription = data.kioskDescription || "";
            const handle = data.handle || docSnap.id;

            if (
              storeName.toLowerCase().includes(queryLower) ||
              categoryFocus.toLowerCase().includes(queryLower) ||
              kioskDescription.toLowerCase().includes(queryLower)
            ) {
              foundVendors += `📍 MATCHING VERIFIED MERCHANT DIRECTORY NODE:\n`;
              foundVendors += `- Brand Name: ${storeName}\n`;
              foundVendors += `- Category Tags: ${categoryFocus || "General"}\n`;
              foundVendors += `- Kiosk Summary Presentation: "${kioskDescription}"\n`;
              foundVendors += `- Storefront Route URL Path: /storefront/${handle}\n\n`;
            }
          });
        }

        dynamicDatabaseContext += foundVendors 
          ? `[MATCHING VENDORS FOUND]\n${foundVendors}` 
          : `[MATCHING VENDORS FOUND]\nNone matching keyword parameter "${message}" explicitly.\n\n`;

        // B. Scan Individual Product Listings
        const listingsSnapshot = await adminDb.collection("listings").get().catch((err) => {
          console.error("Listings collection read failure:", err);
          return null;
        });

        let foundAssets = "";
        if (listingsSnapshot && listingsSnapshot.docs) {
          listingsSnapshot.docs.forEach((docSnap) => {
            const data = docSnap.data() || {};
            const title = data.title || "";
            const description = data.description || "";
            const price = data.totalPriceUSD || data.price || 0;

            if (title.toLowerCase().includes(queryLower) || description.toLowerCase().includes(queryLower)) {
              foundAssets += `- Product Title: ${title}\n`;
              foundAssets += `  Evaluation: $${price} USD\n`;
              foundAssets += `  Item Catalog Link Route URL Path: /market/asset/${docSnap.id}\n\n`;
            }
          });
        }

        if (foundAssets) {
          dynamicDatabaseContext += `[MATCHING INDIVIDUAL PRODUCTS FOUND]\n${foundAssets}`;
        }

      } catch (dbInnerError) {
        // Captures any data-mapping mismatches or unexpected internal field types
        console.error("Internal loop parsing exception handled:", dbInnerError);
        dynamicDatabaseContext += "Notice: Real-time network registries processing error.\n\n";
      }
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

    // ─────────────────────────────────────────────────────────────────────────────
    // 🤖 GEMINI API CONTEXT COMPLETION DISPATCH
    // ─────────────────────────────────────────────────────────────────────────────
    // Using a standard fetch pattern to interact cleanly with the Gemini REST API endpoints
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: systemPrompt }] },
            ...body.history || [],
            { role: "user", parts: [{ text: message }] }
          ]
        })
      }
    );

    const result = await response.json();
    const botReply = result?.candidates?.[0]?.content?.parts?.[0]?.text || 
                     "I apologize, I am processing an internal telemetry disruption. Please re-state your marketplace request.";

    return NextResponse.json({ reply: botReply });

  } catch (globalError) {
    console.error("Critical root exception handled on ai-chat API thread:", globalError);
    return NextResponse.json({ 
      reply: "The AI Concierge kiosk is running a background recovery sequence. Please retry your navigation prompt shortly." 
    }, { status: 500 });
  }
}
