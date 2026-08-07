import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from "@/lib/firebase/admin"; 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const { storeId, itemName, itemPrice, agentId } = await req.json();

    // 🔍 1. Lookup the Merchant's Storefront and Stripe ID
    const storeRef = adminDb.collection("storefronts").doc(storeId);
    const storeDoc = await storeRef.get();

    if (!storeDoc.exists) {
      return NextResponse.json({ error: "Storefront not found." }, { status: 404 });
    }

    const storeData = storeDoc.data();
    const destinationStripeId = storeData?.stripeAccountId;

    if (!destinationStripeId) {
      return NextResponse.json({ error: "Merchant has not connected a payout account yet." }, { status: 400 });
    }

    // 🧮 2. Execute the 3% Bazaria Fee Math
    const totalChargeInCents = Math.round(itemPrice * 100);
    const bazariaFeeInCents = Math.round(totalChargeInCents * 0.03); // 3% Platform Fee

    // 🚀 3. Build the Checkout Session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: itemName,
              description: `Sold by: ${storeData.merchantName || storeData.name}`,
            },
            unit_amount: totalChargeInCents,
          },
          quantity: 1,
        },
      ],
      // This block handles the routing and the fee split!
      payment_intent_data: {
        application_fee_amount: bazariaFeeInCents,
        transfer_data: {
          destination: destinationStripeId,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/store/${storeId}`,
    };

    // 4. Attach agent referral metadata if an agent was involved
    if (agentId) {
      sessionParams.metadata = {
        agentReferral: agentId
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("Merchant Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
