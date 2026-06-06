// app/api/ai-chat/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = (body.message || "").toLowerCase().trim();

    // 📍 LOCAL ROUTING LOGIC ENGINE (NO REMOTE API DEPENDENCIES)
    // 📍 UPDATE ONLY THIS CONDITIONAL BLOCK INSIDE YOUR ROUTE
if (message.includes("truck") || message.includes("storefront") || message.includes("vendor")) {
  return NextResponse.json({
    reply: "Yes, we have verified vendors available in that category. The main provider carrying fleet solutions, heavy-duty utility models, and industrial logistics vehicles is Blue Merchant. You can seamlessly browse their entire inventory selection directly by clicking through to their dedicated storefront page in the application directory."
  });
}

// 📚 DYNAMIC KNOWLEDGE FILE SEARCH ENGINE (SCANS THE ENTIRE DIRECTORY)
if (
  message.includes("compliance") || 
  message.includes("rule") || 
  message.includes("terms") || 
  message.includes("agent") || 
  message.includes("tier") || 
  message.includes("commission") ||
  message.includes("policy") ||
  message.includes("framework")
) {
  try {
    const knowledgeDirectory = path.join(process.cwd(), "lib", "ai", "knowledge");
    
    if (fs.existsSync(knowledgeDirectory)) {
      // 1. Read all files inside the knowledge directory
      const allFiles = fs.readdirSync(knowledgeDirectory);
      
      // Filter for markdown files and look for an explicit match
      const matchingFile = allFiles.find(file => {
        const fileNameLower = file.toLowerCase();
        
        // Match specific keywords to their respective files
        if (message.includes("agent") || message.includes("commission") || message.includes("tier")) {
          return fileNameLower.includes("agent");
        }
        if (message.includes("terms") || message.includes("condition")) {
          return fileNameLower.includes("terms");
        }
        if (message.includes("privacy") || message.includes("policy")) {
          return fileNameLower.includes("privacy");
        }
        if (message.includes("high ticket") || message.includes("dispute")) {
          return fileNameLower.includes("high_ticket");
        }
        if (message.includes("framework") || message.includes("qa") || message.includes("ops")) {
          return fileNameLower.includes("framework");
        }
        
        return false;
      });

      // 2. If a specific document matches the query, read and serve it
      if (matchingFile) {
        const targetPath = path.join(knowledgeDirectory, matchingFile);
        const documentContent = fs.readFileSync(targetPath, "utf8");
        return NextResponse.json({ reply: documentContent });
      }
    }
    
   // ... (This is the end of your dynamic files loop)
    return NextResponse.json({
      reply: "I recognized your compliance inquiry. While I couldn't find a direct file match..."
    });

  } catch (readError) {
    console.error("Dynamic document folder scanning exception:", readError);
    return NextResponse.json({
      reply: "The AI Concierge encountered an internal access loop..."
    });
  }
} // 📍 BRACE 1: This closes the compliance "if" statement block!

// 🛍️ GLOBAL GREETING (Now sits safely inside the main POST try block)
return NextResponse.json({
  reply: "Welcome to Bazaria. I am your AI Concierge, here to guide you through our premier global marketplace. I can assist you with locating products, navigating platform features, or answering compliance questions. To ensure the highest level of service, I always prioritize routing you to our verified Storefront Merchants and premier boutiques first. Please let me know what you are looking to discover today!"
});

// 📍 BRACE 2: This closes the main function's opening try block!
} catch (globalError) {
  console.error("Local chat thread exception:", globalError);
  return NextResponse.json({
    reply: "The Bazaria AI Concierge system is processing a routine background update. Please resubmit your inquiry shortly."
  });
}
} // 📍 BRACE 3: This closes the export async function POST block!
