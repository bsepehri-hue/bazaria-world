import { NextResponse, NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin"; // Import your new admin file
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const { amount, assetId, isDigital } = await req.json();

    // 1. ADMIN SDK: Fetch the asset
    // Note: No 'doc()' or 'getDoc()' here. Use collection().doc().get()
    const assetRef = adminDb.collection("assets").doc(assetId);
    const assetDoc = await assetRef.get();

    if (!assetDoc.exists) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const assetData = assetDoc.data();
    
    // 2. HARD LOCK logic (stays the same, just use assetData properties)
    const isExpired = Date.now() > new Date(assetData?.endTime).getTime();
    const reserveMet = Number(assetData?.currentBid) >= Number(assetData?.reservePrice);

    if (isExpired && !reserveMet) {
      return NextResponse.json({ error: "Auction failed: Reserve not met" }, { status: 403 });
    }

    // ... continue with your Stripe session creation ...
    // Remember to use assetData.title, assetData.sellerId, etc.

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
