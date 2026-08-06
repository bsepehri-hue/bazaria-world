import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirestore } from "firebase-admin/firestore";
import "@/lib/firebase/admin"; 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const db = getFirestore();
    const { agentId, item, title, qty, totalAmountDue } = await req.json();

    // 🔍 1. Lookup the Agent's Stripe Connect ID in Firebase
    let destinationStripeId = null;
    if (agentId) {
      // Assuming you store their ref code or ID in a partners/users collection
      const agentsRef = db.collection("partners"); 
      const q = agentsRef.where("referralCode", "==", agentId).limit(1);
      const snapshot = await q.get();
      
      if (!snapshot.empty) {
        destinationStripeId = snapshot.docs[0].data().stripeAccountId;
      }
    }

    // 🧮 2. Execute the 50% Split Math
    const totalChargeInCents = Math.round(totalAmountDue * 100);
    const agentCommissionInCents = Math.round(totalChargeInCents * 0.50); // 50% goes to the agent
    const bazariaHoldbackInCents = totalChargeInCents - agentCommissionInCents; // 50% stays with Bazaria

    // 🛒 3. Build the Stripe Session Parameters
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Bulk Ad Listing: ${item.toUpperCase()}`,
              description: `Target Asset: ${title.toUpperCase()} | Agent Ref: ${agentId}`,
            },
            unit_amount: totalChargeInCents, // This must be the total cost of the package
          },
          quantity: 1, // We bundled the cost into the unit_amount above based on the qty multiplier
        },
      ],
      // Redirect paths after payment succeeds or fails
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/market?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pay?agent=${agentId}&item=${item}&title=${title}&qty=${qty}`,
    };

    // 💸 4. Attach the 50% routing logic IF the agent is fully verified
    if (destinationStripeId) {
      sessionParams.payment_intent_data = {
        application_fee_amount: bazariaHoldbackInCents,
        transfer_data: {
          destination: destinationStripeId,
        },
      };
    }

    // 🚀 5. Generate the Checkout URL
    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("Ad Listing Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
