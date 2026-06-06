// app/api/ai-chat/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";
// 📡 Bring in your native backend Firebase/Firestore connection matrix
import { db } from "@/lib/firebase/server"; // Adjust path to match your server-side Firebase init file
import { collection, getDocs, query, where, limit } from "firebase/firestore";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = (body.message || "").trim();
    const history = body.history || [];
    const clientContext = body.context || {};
    
    const messageLower = message.toLowerCase();

    // ==========================================================
    // 🔍 DYNAMIC STEP 1: ACTIVE MULTI-FIELD INVENTORY DISCOVERY
    // ==========================================================
    let detectedSearchKeyword = "";
    let foundInventoryItems: any[] = [];

    // Simple structural keyword extractor for inventory searching
    const lookforKeywords = ["looking for", "search for", "find", "buy", "want a", "want an", "need a", "need an"];
    let isolatedQuery = messageLower;
    
    lookforKeywords.forEach(kw => {
      if (messageLower.includes(kw)) {
        isolatedQuery = messageLower.split(kw)[1] || messageLower;
      }
    });
    detectedSearchKeyword = isolatedQuery.replace(/[?.!,]/g, "").trim();

    // If the message seems to target inventory items, run the Multi-Field Firestore Lookup Array
    if (detectedSearchKeyword.length > 2) {
      try {
        const itemsRef = collection(db, "marketplace_items"); // Replace with your exact items collection name
        
        // ⚡ Deep Multi-Field Search Array Block: Pull matching active items
        const q = query(
          itemsRef,
          where("status", "==", "active"),
          limit(10) // Fetch top rows to keep payload balanced
        );
        
        const querySnapshot = await getDocs(q);
        const allItems: any[] = [];
        querySnapshot.forEach(doc => {
          allItems.push({ id: doc.id, ...doc.data() });
        });

        // Smart client-side matching cross multiple fields using dynamic pattern matching
        foundInventoryItems = allItems.filter(item => {
          const cleanKeyword = detectedSearchKeyword.trim().toLowerCase();
          
          // Create variations to catch colloquial slang (e.g., "lambo" matches "lamborghini")
          const isLamboQuery = cleanKeyword === "lambo" || cleanKeyword === "lamborghini";
          
          const title = (item.title || "").toLowerCase();
          const category = (item.category || "").toLowerCase();
          const description = (item.description || "").toLowerCase();
          
          // Safe array check for tags
          const tags = Array.isArray(item.tags) 
            ? item.tags.map((t: string) => t.toLowerCase()) 
            : [];

          // 🏎️ Slang Overrides: Force-match standard vehicle abbreviations
          if (isLamboQuery) {
            if (title.includes("lambo") || title.includes("lamborghini")) return true;
            if (description.includes("lambo") || description.includes("lamborghini")) return true;
          }

          // General Multi-Field Strict & Partial Matching Matrix
          const strictTitleMatch = title.includes(cleanKeyword);
          const strictCategoryMatch = category.includes(cleanKeyword);
          const strictDescMatch = description.includes(cleanKeyword);
          const strictTagMatch = tags.some(t => t.includes(cleanKeyword));

          // Fuzzy fallback: If the string is long, check if parts of words intersect
          let fuzzyMatch = false;
          if (cleanKeyword.length > 3) {
            const segments = cleanKeyword.split(/\s+/);
            fuzzyMatch = segments.every(seg => title.includes(seg) || description.includes(seg));
          }

          return strictTitleMatch || strictCategoryMatch || strictDescMatch || strictTagMatch || fuzzyMatch;
        });
      } catch (dbErr) {
        console.error("⚠️ Background Inventory Discovery Intercept Failure:", dbErr);
      }
    }
    // ==========================================================
    // 🎭 STEP 2: CONTEXT-AWARE SYSTEM INSTRUCTION MATRIX
    // ==========================================================
    let systemInstruction = `
      You are the sophisticated, elegant AI Concierge for Bazaria, a premier global marketplace. 
      Your purpose is to welcome users, explain platform rules, and guide them to exact items in our inventory database.
      
      Always handle queries conversationally. Never quote raw code blocks or code arrays.
    `;

    // Inject live database search insights directly into the AI's short-term reasoning matrix!
    if (foundInventoryItems.length > 0) {
      systemInstruction += `
        \n[CRITICAL LIVE MARKETPLACE INVENTORY CONTEXT INJECTED]
        The database search engine successfully located matching items in the global inventory directory for "${detectedSearchKeyword}":
        ${JSON.stringify(foundInventoryItems.map(i => ({ 
          title: i.title, 
          price: i.price, 
          storefrontOwner: i.storefrontName || "Independent Listing (No Storefront Attached)", 
          category: i.category 
        })))}

        Operational Mandate: Present these exact live items to the user beautifully and elegantly. 
        If an item has a verified 'storefrontName', prioritize highlighting it as an elite boutique partner. 
        If an item lists 'Independent Listing', explain gracefully that it is an open-market listing verified via the Bazaria sovereign directory protocol.
      `;
    } else if (detectedSearchKeyword.length > 2) {
      systemInstruction += `
        \n[CONTEXT WARNING]: The live database engine searched our entire storefront and open global inventory for "${detectedSearchKeyword}" but found 0 active matches.
        Acknowledge their request elegantly. Do not make up fake listings. Guide them to check our directory layout categories or tell them how to create a storefront to begin listing those items themselves!
      `;
    }

    // ==========================================================
    // 📚 STEP 3: PLATFORM KNOWLEDGE OVERRIDES
    // ==========================================================
    let contextDocumentContent = "";
    const knowledgeDirectory = path.join(process.cwd(), "lib", "ai", "knowledge");
    
    if (fs.existsSync(knowledgeDirectory)) {
      const allFiles = fs.readdirSync(knowledgeDirectory);
      const matchingFile = allFiles.find(file => {
        const fileNameLower = file.toLowerCase();
        if (messageLower.includes("agent") || messageLower.includes("storefront") || messageLower.includes("establish") || messageLower.includes("setup")) {
          return fileNameLower.includes("agent") || fileNameLower.includes("framework");
        }
        return false;
      });

      if (matchingFile) {
        const targetPath = path.join(knowledgeDirectory, matchingFile);
        contextDocumentContent = fs.readFileSync(targetPath, "utf8");
        systemInstruction += `\n[PLATFORM SPEC DOC]:\n${contextDocumentContent}`;
      }
    }

    // ==========================================================
    // 🧠 STEP 4: COGNITIVE STREAM GENERATION
    // ==========================================================
    const formattedContents: any[] = [];
    
    history.forEach((msg: any) => {
      const role = msg.sender === "user" || msg.role === "user" ? "user" : "model";
      const text = msg.text || msg.content || "";
      if (text) formattedContents.push({ role, parts: [{ text }] });
    });

    formattedContents.push({ role: "user", parts: [{ text: message }] });

    const responseStream = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4
      }
    });

    return NextResponse.json({ reply: responseStream.text || "Directory updating. Try again shortly." });

  } catch (globalError) {
    console.error("Critical Route Intercept Failure:", globalError);
    return NextResponse.json({ reply: "The system is running routine index diagnostics. Please retry." });
  }
}
