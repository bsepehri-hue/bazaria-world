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
    
    // 💡 AUTOMATED SEARCH ENGINE FALLBACK: If no exact file matches, list the directory index
    return NextResponse.json({
      reply: "I recognized your compliance inquiry. While I couldn't find a direct file match for your phrasing, I have access to the following repository manifests: 04_High Ticket Compliance, 05_Terms and Conditions, 06_Privacy Policy, 07_Listing Agent Agreement, and 08_QA and Ops Framework. Please clarify which handbook you'd like me to query."
    });

  } catch (readError) {
    console.error("Dynamic document folder scanning exception:", readError);
    return NextResponse.json({
      reply: "The AI Concierge encountered an internal access loop while trying to read the marketplace's document frameworks. Please verify directory node permissions."
    });
  }
}
