import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/firebase/client"; // Point to your existing client-side Firebase file
import { doc, getDoc } from "firebase/firestore"; // Use the standard SDK
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const { amount, assetId, isDigital } = await req.json();

    // 1. CLIENT SDK: Fetch the asset (This uses your existing architecture)
    const assetRef = doc(db, "assets", assetId);
    const assetSnap = await getDoc(assetRef);

    if (!assetSnap.exists()) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const assetData = assetSnap.data();
    
    // 2. HARD LOCK logic (using your existing data structure)
    const isExpired = Date.now() > new Date(assetData.endTime).getTime();
    const reserveMet = Number(assetData.currentBid) >= Number(assetData.reservePrice);

    if (isExpired && !reserveMet) {
      return NextResponse.json({ error: "Auction failed: Reserve not met" }, { status: 403 });
    }

    // ... continue with your Stripe logic ...

    // 3. FEE LOGIC: Calculate 3% Buyer Fee
    const basePrice = Number(amount) / 100;
    const buyerFee = basePrice * 0.03;
    const totalToCharge = Math.round((basePrice + buyerFee) * 100);

    // 4. STRIPE SESSION
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { 
            name: assetData?.title || "Marketplace Item",
            description: "Includes 3% service fee"
          },
          unit_amount: totalToCharge,
        },
        quantity: 1,
      }],
      mode: 'payment',
      automatic_tax: { enabled: true },
      shipping_address_collection: isDigital ? undefined : { allowed_countries: ['US', 'CA'] },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/market/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/market/checkout`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
