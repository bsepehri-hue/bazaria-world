import { NextResponse } from "next/server";
import Stripe from "stripe";
import "@/lib/firebase/admin";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const db = getFirestore();
    const { agentUid, items, grandTotalAmount } = await req.json();

    if (!agentUid || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required payload data" }, { status: 400 });
    }

    // 1. Verify the Agent's Token Balance in Firestore
    const agentRef = db.collection("partners").doc(agentUid);
    const agentDoc = await agentRef.get();
    const currentTokens = agentDoc.data()?.available || 0;

    if (currentTokens < grandTotalAmount) {
      return NextResponse.json({ error: "Insufficient Bazaria Tokens" }, { status: 403 });
    }

    // 2. Process Seller Payouts via Stripe Connect
    // We loop through the cart to ensure each seller gets their real fiat currency
    for (const item of items) {
      const sellerId = item.sellerId; 
      
      // 🚨 NEW GUARDRAIL: Catch missing seller IDs before Firestore crashes
      if (!sellerId) {
        return NextResponse.json({ 
          error: `The item "${item.title || 'Unknown'}" is missing a seller ID in the cart payload. Please empty cart and re-add.` 
        }, { status: 400 });
      }

      // Look up the seller's Stripe Connect ID in your database
      const sellerDoc = await db.collection("partners").doc(sellerId).get();
      const sellerStripeAccountId = sellerDoc.data()?.stripeAccountId;

      if (!sellerStripeAccountId) {
        throw new Error(`Seller ${sellerId} is not fully onboarded with Stripe.`);
      }

      // 💸 THE MAGIC ROUTER: Move money from Bazaria Platform -> Seller's Stripe Account
      // Note: Stripe requires amounts in cents (e.g., $10.00 = 1000)
      const amountInCents = Math.round(item.price * item.quantity * 100);
      
      await stripe.transfers.create({
        amount: amountInCents,
        currency: "usd",
        destination: sellerStripeAccountId,
        description: `Marketplace Token Purchase: ${item.title}`,
      });
    }

    // 3. Deduct the tokens from the Agent's balance
    await agentRef.update({
      available: FieldValue.increment(-grandTotalAmount)
    });

    // 4. Return the success signal to the frontend
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Token Checkout Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
