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
    
  // 🛍️ PLATFORM GLOBAL GREETING & MERCHANT DIRECTORY PREFERENCE ROUTING
    return NextResponse.json({
      reply: "Welcome to Bazaria. I am your AI Concierge, here to guide you through our premier global marketplace. I can assist you with locating products, navigating platform features, or answering compliance questions. To ensure the highest level of service, I always prioritize routing you to our verified Storefront Merchants and premier boutiques first. Please let me know what you are looking to discover today!"
    });

  } catch (readError) {
    console.error("Local document reading exception:", readError);
    return NextResponse.json({
      reply: "I recognized your inquiry regarding platform guidelines, but I encountered a minor issue accessing our local compliance repository nodes. Please try again shortly."
    });
  }
}

  } catch (globalError) {
    console.error("Local chat thread exception:", globalError);
    return NextResponse.json({
      reply: "The Bazaria AI Concierge system is processing a routine background update. Please resubmit your inquiry shortly."
    });
  }
}
