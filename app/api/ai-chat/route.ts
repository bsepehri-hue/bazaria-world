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

// 📚 KNOWLEDGE READ BYPASS: Triggers when asking about training, rules, or agent tiers
if (
  message.includes("compliance") || 
  message.includes("rule") || 
  message.includes("terms") || 
  message.includes("agent") || 
  message.includes("tier")
) {
  return NextResponse.json({
    reply: "The platform's operational frameworks, global compliance rules, and listing agent protocols are fully loaded into the system architecture. Please specify if you need details on seller liability, tier commissions, or specific administrative guidelines so I can provide the exact reference text."
  });
}

    // Default neutral kiosk assistant reply
    return NextResponse.json({
      reply: "Welcome to the Kiosk. Please specify if you are looking for available merchant storefronts, active inventory categories, or platform compliance directories so I can direct your portal view."
    });

  } catch (globalError) {
    console.error("Local chat thread exception:", globalError);
    return NextResponse.json({
      reply: "The application kiosk is currently executing a background routine. Please resubmit your portal search request shortly."
    });
  }
}
