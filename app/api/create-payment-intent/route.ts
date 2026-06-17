import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Ensure you import your Firestore db

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const { amount, assetId, merchantId, isDigital } = await request.json();

    // 1. HARD LOCK: Validate Asset & Auction Integrity
    const assetRef = doc(db, "assets", assetId);
    const assetDoc = await getDoc(assetRef);
    if (!assetDoc.exists()) return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    
    const assetData = assetDoc.data();
    const isExpired = Date.now() > new Date(assetData.endTime).getTime();
    const reserveMet = Number(assetData.currentBid) >= Number(assetData.reservePrice);
    
    // Block if auction failed or still in progress
    if (isExpired && !reserveMet) return NextResponse.json({ error: "Auction failed: Reserve not met" }, { status: 403 });
    if (!isExpired && assetData.saleMode === 'auction') return NextResponse.json({ error: "Auction in progress" }, { status: 403 });

    // 2. Calculate Fees (3% Buyer + 3% Seller)
    const basePrice = Number(amount) / 100;
    const buyerFee = basePrice * 0.03;
    const totalCollectedFromBuyer = basePrice + buyerFee; // Stripe charges this

    // 3. Create Session with Transfer Group
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: assetData.title },
          unit_amount: Math.round(totalCollectedFromBuyer * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      automatic_tax: { enabled: true },
      shipping_address_collection: isDigital ? undefined : { allowed_countries: ['US', 'CA'] },
      payment_intent_data: {
        transfer_group: `ORDER_${assetId}_${Date.now()}`,
        metadata: { merchantId, basePrice, sellerFee: basePrice * 0.03 } // Store for webhook
      },
      success_url: `.../success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `.../checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
