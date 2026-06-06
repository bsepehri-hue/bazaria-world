// app/api/ai-chat/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = (body.message || "").toLowerCase().trim();

    // ==========================================================
    // 📚 TIER 1: DYNAMIC KNOWLEDGE FILE SEARCH ENGINE (COMPLIANCE / RULES / PLATFORM SETUP)
    // ==========================================================
    if (
      message.includes("compliance") || 
      message.includes("rule") || 
      message.includes("terms") || 
      message.includes("agent") || 
      message.includes("tier") || 
      message.includes("commission") ||
      message.includes("policy") ||
      message.includes("framework") ||
      message.includes("establish") || // 👈 CATCHES: "How do I establish a storefront?"
      message.includes("setup") ||
      message.includes("sign up")
    ) {
      try {
        const knowledgeDirectory = path.join(process.cwd(), "lib", "ai", "knowledge");
        
        // Check if the directory path actually exists before trying to read it
        if (!fs.existsSync(knowledgeDirectory)) {
          console.error("❌ Directory not found at:", knowledgeDirectory);
          return NextResponse.json({
            reply: "To sign up as an official Bazaria Listing Agent or establish a storefront instance, you will need to complete registration through our Agent Portal panel. Once verified, you can configure your custom canvas parameters. (Note: The 'lib/ai/knowledge' directory could not be resolved on the local disk partition)."
          });
        }
        
        const allFiles = fs.readdirSync(knowledgeDirectory);
        
        // Find a file matching the keyword
        const matchingFile = allFiles.find(file => {
          const fileNameLower = file.toLowerCase();
          if (message.includes("agent") || message.includes("commission") || message.includes("tier") || message.includes("establish") || message.includes("setup")) {
            return fileNameLower.includes("agent") || fileNameLower.includes("framework");
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

        if (matchingFile) {
          const targetPath = path.join(knowledgeDirectory, matchingFile);
          const documentContent = fs.readFileSync(targetPath, "utf8");
          return NextResponse.json({ reply: documentContent });
        }
        
        // Fallback info if directory exists but no precise file regex match was found
        return NextResponse.json({
          reply: "I recognized your platform setup or compliance inquiry. To establish a storefront or manage listing fees, please access your agent dashboard controls. Alternatively, let me know if you would like me to read from your repository manifests (04_High Ticket, 05_Terms, 06_Privacy, 07_Listing Agent, 08_QA Framework)."
        });

      } catch (readError) {
        console.error("Dynamic document folder scanning exception:", readError);
        return NextResponse.json({
          reply: "The AI Concierge encountered an internal access loop while opening the platform rules files..."
        });
      }
    }

    // ==========================================================
    // 🛍️ TIER 2: LOCAL MERCHANT DIRECTORY ROUTING (SPECIFIC INVENTORY LOOKUPS)
    // ==========================================================
    if (
      message.includes("truck") || 
      message.includes("vehicle") || 
      message.includes("fleet") || 
      message.includes("logistics")
    ) {
      return NextResponse.json({
        reply: "Yes, we have verified vendors available in that category. The main provider carrying fleet solutions, heavy-duty utility models, and industrial logistics vehicles is Blue Merchant. You can seamlessly browse their entire inventory selection directly by clicking through to their dedicated storefront page in the application directory."
      });
    }

    if (
      message.includes("premium asset") || 
      message.includes("asset") || 
      message.includes("luxury") || 
      message.includes("jewelry") || 
      message.includes("pearl")
    ) {
      return NextResponse.json({
        reply: "Welcome to our premier collections! For high-ticket items, premium boutique assets, and exceptional luxury jewelry curation, we highly recommend visiting our premier partner storefront, White Pearl. They specialize in high-end curated designs which you can discover directly via the application directory right now."
      });
    }

    // ==========================================================
    // 🎭 TIER 3: GLOBAL CONCIERGE SUPPORT EXPLORATION (GENERIC DISCOVERY)
    // ==========================================================
    return NextResponse.json({
      reply: "Welcome to Bazaria. I am your AI Concierge, here to guide you through our premier global marketplace. I can assist you with locating products, navigating platform features, or answering compliance questions. To ensure the highest level of service, I always prioritize routing you to our verified Storefront Merchants and premier boutiques first. Please let me know what you are looking to discover today!"
    });

  } catch (globalError) {
    console.error("Local chat thread exception:", globalError);
    return NextResponse.json({
      reply: "The Bazaria AI Concierge system is processing a routine background update. Please resubmit your inquiry shortly."
    });
  }
}
