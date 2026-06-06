// app/api/ai-chat/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 1. PLACE THE MATRIX HERE
const KNOWLEDGE_MATRIX: Record<string, string> = {
  "/legal/terms": "05_terms_and_conditions.md",
  "/legal/privacy": "06_privacy_policy.md",
  "/dashboard/agent-portal": "07_listing_agent_agreement.md",
  "/dashboard/disputes": "04_high_ticket_compliance.md",
  "/admin/system-oversight": "08_qa_and_ops_framework.md",
  default: "01_merchant_onboarding.md",
};

// 🛰️ LAZY-LOAD FIREBASE ADMIN SAFELY TO PREVENT COMPILATION CRASHES
async function getFirebaseAdminDb() {
  try {
    const { adminDb } = await import("@/lib/firebase/admin");
    return adminDb;
  } catch (initErr) {
    console.error("Firebase Admin initialization or import failure:", initErr);
    return null;
  }
}

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
    // 🛰️ LIVE ADMIN FIRESTORE SEARCH ENGINE (LAZY LOADED WITH CRASH PROTECTION)
    // ─────────────────────────────────────────────────────────────────────────────
    if (queryLower) {
      const adminDb = await getFirebaseAdminDb();

      if (!adminDb) {
        console.warn("Skipping dynamic database scan: adminDb instance could not be initialized.");
        dynamicDatabaseContext += "Notice: Real-time network registries currently offline (Initialization Failure).\n\n";
      } else {
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
          console.error("Internal loop parsing exception handled:", dbInnerError);
          dynamicDatabaseContext += "Notice: Real-time network registries processing error.\n\n";
        }
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
  - For a verified merchant's storefront link, use: [Store Name](/storefront/[handle_or_id])

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
    console.log("Telemetry Ping: Sanitizing history and dispatching payload array stream...");

    // 📍 1. SANITIZE HISTORY ARRAY ON THE FLY
    // Maps frontend structures safely into Google's strict role/parts schema
    const sanitizedHistory = (history || []).map((msg: any) => {
      // Determine correct role string mapping
      const isModel = msg.role === "model" || msg.role === "assistant" || msg.sender === "bot" || msg.sender === "ai";
      const cleanRole = isModel ? "model" : "user";
      
      // Extract underlying message text from any incoming variable format
      const rawText = msg.text || msg.content || (msg.parts?.[0]?.text) || "";

      return {
        role: cleanRole,
        parts: [{ text: rawText }]
      };
    }).filter((msg: any) => msg.parts[0].text.trim() !== ""); // Filter out empty messages

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
            ...sanitizedHistory, // 📍 2. Inject your perfectly cleaned history array here
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
        reply: "Welcome to the Bazaria Kiosk. I am refreshing my ledger alignment tracks. Please re-state your marketplace vendor request." 
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
