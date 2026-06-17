import { NextResponse, NextRequest } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Stripe from "stripe";

// 1. SELF-CONTAINED INITIALIZATION (Bypassing external imports to guarantee 'db' exists)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if app exists, if not, initialize it
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  // DEBUG: If this prints undefined, your environment variables are not loading in the API route
  console.log("Database initialized:", !!db);

  try {
   const { amount, assetId, isDigital } = await req.json();

    // ADD THIS DEBUG CHECK
    if (!assetId) {
      console.error("DEBUG: assetId is missing from request body!");
      return NextResponse.json({ error: "assetId is required" }, { status: 400 });
    }
    console.log("DEBUG: assetId received:", assetId);

    // 2. FETCH ASSET
    const assetRef = doc(db, "assets", assetId);

    // 2. FETCH ASSET
    const assetRef = doc(db, "assets", assetId);
    const assetSnap = await getDoc(assetRef);

    if (!assetSnap.exists()) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const assetData = assetSnap.data();
    
    // 3. HARD LOCK logic
    const endTime = assetData.endTime?.toDate ? assetData.endTime.toDate().getTime() : new Date(assetData.endTime).getTime();
    const isExpired = Date.now() > endTime;
    const reserveMet = Number(assetData.currentBid || 0) >= Number(assetData.reservePrice || 0);

    if (isExpired && !reserveMet) {
      return NextResponse.json({ error: "Auction failed: Reserve not met" }, { status: 403 });
    }

    // 4. FEE LOGIC
    const basePrice = Number(amount) / 100;
    const buyerFee = basePrice * 0.03;
    const totalToCharge = Math.round((basePrice + buyerFee) * 100);

    // 5. STRIPE SESSION
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { 
            name: assetData.title || "Marketplace Item",
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
    console.error("Payment Intent Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
