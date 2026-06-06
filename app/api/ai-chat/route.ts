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

    const lookforKeywords = ["looking for", "search for", "find", "buy", "want a", "want an", "need a", "need an", "have any", "have a"];
    let isolatedQuery = messageLower;
    
    lookforKeywords.forEach(kw => {
      if (messageLower.includes(kw)) {
        isolatedQuery = messageLower.split(kw)[1] || messageLower;
      }
    });
    detectedSearchKeyword = isolatedQuery.replace(/[?.!,]/g, "").trim();

    if (detectedSearchKeyword.length > 2) {
      try {
        console.log(`📡 Server-Side Inventory Scan Initiated for Keyword: "${detectedSearchKeyword}"`);

        // 🛡️ Robust Server-Safe Data Pulling (Compatible with Admin & Web Node Layouts)
        // Try multiple common collection variant names automatically to guarantee a match
        const collectionsToTry = ["marketplace_items", "listings", "auctions", "products"];
        let snapshot: any = null;
        let finalCollectionName = "";

        for (const colName of collectionsToTry) {
          try {
            // Check if db exposes standard server admin syntax (.collection) vs web syntax
            const colRef = typeof db.collection === "function" 
              ? db.collection(colName) 
              : collection(db, colName);
              
            const q = typeof colRef.limit === "function"
              ? colRef.limit(30)
              : query(colRef, limit(30));

            const checkDocs = typeof getDocs === "function" ? await getDocs(q) : await q.get();
            
            if (checkDocs && (checkDocs.size > 0 || (checkDocs.docs && checkDocs.docs.length > 0))) {
              snapshot = checkDocs;
              finalCollectionName = colName;
              break; // Found the active repository! Stop checking layout branches.
            }
          } catch (colErr) {
            // Quietly shift to the next naming schema variant
            continue;
          }
        }

        const allItems: any[] = [];
        if (snapshot) {
          console.log(`✅ Connection secure! Connected to database collection: "${finalCollectionName}"`);
          const docsArray = snapshot.docs || [];
          docsArray.forEach((doc: any) => {
            allItems.push({ id: doc.id, ...doc.data() });
          });
        }

        // Deep Multi-Field Pattern Filter
        foundInventoryItems = allItems.filter(item => {
          const cleanKeyword = detectedSearchKeyword.toLowerCase().trim();
          
          // Structural Synonym Expanders
          const isLambo = cleanKeyword === "lambo" || cleanKeyword === "lamborghini";
          const isVilla = cleanKeyword === "villa" || cleanKeyword === "house" || cleanKeyword === "mansion" || cleanKeyword === "property";

          const title = (item.title || "").toLowerCase();
          const description = (item.description || "").toLowerCase();
          const category = (item.category || "").toLowerCase();
          const tags = Array.isArray(item.tags) ? item.tags.map((t: any) => String(t).toLowerCase()) : [];

          // Synchronic Slang Multi-Matches
          if (isLambo && (title.includes("lambo") || title.includes("lamborghini"))) return true;
          if (isVilla && (title.includes("villa") || title.includes("demarc") || title.includes("estate"))) return true;

          // Standard Multi-Field Fallbacks
          const titleMatch = title.includes(cleanKeyword);
          const descMatch = description.includes(cleanKeyword);
          const catMatch = category.includes(cleanKeyword);
          const tagMatch = tags.some(t => t.includes(cleanKeyword));

          return titleMatch || descMatch || catMatch || tagMatch;
        });

        console.log(`📊 Filter complete. Context injection array payload size: ${foundInventoryItems.length} items.`);
      } catch (dbErr) {
        console.error("⚠️ Server Core Inventory Query Exception Intercepted:", dbErr);
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
