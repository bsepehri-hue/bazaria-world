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

// 📚 KNOWLEDGE READ BYPASS: Reads and serves the exact document content locally
if (
  message.includes("compliance") || 
  message.includes("rule") || 
  message.includes("terms") || 
  message.includes("agent") || 
  message.includes("tier") || 
  message.includes("commission")
) {
  try {
    // Look for the listing agent agreement document in your local repository
    const agentFilePath = path.join(process.cwd(), "lib", "ai", "knowledge", "07_listing_agent_agreement.md");
    
    if (fs.existsSync(agentFilePath)) {
      const documentContent = fs.readFileSync(agentFilePath, "utf8");
      
      // Return the raw text content of the agreement directly to the chat
      return NextResponse.json({
        reply: documentContent
      });
    }
    
   return NextResponse.json({
      reply: "Welcome to the Kiosk. Please specify if you are looking for available merchant storefronts or platform compliance directories so I can direct your portal view."
    });

 } catch (globalError) {
    console.error("Local chat thread exception:", globalError);
    return NextResponse.json({
      reply: "The application kiosk is currently executing a background routine. Please resubmit your portal search request shortly."
    });
  }
} // 📍 Make sure this final brace is here to close out the POST function!
