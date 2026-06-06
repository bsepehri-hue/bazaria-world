// app/api/ai-chat/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = (body.message || "").toLowerCase().trim();

    // 📍 LOCAL ROUTING LOGIC ENGINE (NO REMOTE API DEPENDENCIES)
    if (message.includes("truck") || message.includes("storefront") || message.includes("vendor")) {
      return NextResponse.json({
        reply: "Yes, we have verified vendors available in that category. The main provider carrying fleet solutions, heavy-duty utility models, and industrial logistics vehicles is Blue Merchant. You can seamlessly browse their entire inventory selection directly by clicking through to their dedicated storefront page in the application directory."
      });
    }

    if (message.includes("art") || message.includes("clothing")) {
      return NextResponse.json({
        reply: "Yes, the marketplace contains dedicated boutique registries for retail design, creative arts, and apparel. You can explore active merchant collections by navigating to the storefronts tab in your main application portal panel."
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
