import { NextResponse, NextRequest } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Stripe from "stripe";

// 1. INITIALIZE FIREBASE
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// 2. INITIALIZE STRIPE
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const { amount, assetId, isDigital } = await req.json();

    if (!assetId) {
      return NextResponse.json({ error: "assetId is required" }, { status: 400 });
    }

    // 3. VALIDATE ASSET FROM FIREBASE
    const assetRef = doc(db, "listings", assetId);
    const assetSnap = await getDoc(assetRef);

    if (!assetSnap.exists()) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const assetData = assetSnap.data();

    // 4. AMOUNT CONVERSION (Frontend already calculated the 3% or the 10% binder in dollars)
    // We just need to convert dollars to cents for Stripe (e.g., $2565.20 -> 256520)
    const totalToChargeCents = Math.round(Number(amount) * 100);

    // 5. CREATE STRIPE SESSION
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { 
            name: assetData.title || "Bazaria Marketplace Asset",
            description: "Includes applicable Bazaria Buyer Premium or Escrow Binder"
          },
          unit_amount: totalToChargeCents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      
      // STRIPE HANDLES TAX AND SHIPPING NATIVELY
      automatic_tax: { enabled: true },
      shipping_address_collection: isDigital ? undefined : { allowed_countries: ['US', 'CA'] },
      
      // HARDCODED LOCALHOST URLS (Bypasses the "Invalid URL" Environment Error)
      success_url: `http://localhost:3000/market/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/market/checkout`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
