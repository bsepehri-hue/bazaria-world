import { NextResponse, NextRequest } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Stripe from "stripe";

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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, assetId, isDigital } = body;

    // DEBUG: Print exactly what we are querying
    console.log("DEBUG: Querying Firestore path: assets /", assetId);

    const assetRef = doc(db, "assets", assetId);
    const assetSnap = await getDoc(assetRef);

    if (!assetSnap.exists()) {
      console.error("DEBUG: Document does not exist at path: assets /", assetId);
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const assetData = assetSnap.data();
    
    // Fee Logic
    const basePrice = Number(amount) / 100;
    const buyerFee = basePrice * 0.03;
    const totalToCharge = Math.round((basePrice + buyerFee) * 100);

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
      cancel_url:
