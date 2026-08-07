import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from "@/lib/firebase/admin"; 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const { userId, storeId, email } = await req.json();
    const storeRef = adminDb.collection("storefronts").doc(storeId);
    const storeDoc = await storeRef.get();

    if (!storeDoc.exists) {
      return NextResponse.json({ error: "Storefront not found" }, { status: 404 });
    }

    const storeData = storeDoc.data();
    let stripeAccountId = storeData?.stripeAccountId;

    // 1. Create a Stripe Express account if they don't have one yet
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      stripeAccountId = account.id;

      // Save the new Stripe ID directly to their storefront document
      await storeRef.update({ stripeAccountId: stripeAccountId });
    }

    // 2. Generate the unique onboarding link
    const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${origin}/settings?tab=PAYOUT&stripe=refresh`,
      return_url: `${origin}/settings?tab=PAYOUT&stripe=success`,
      type: 'account_onboarding',
    });

    // 3. Send the URL back to the frontend
    return NextResponse.json({ url: accountLink.url });

  } catch (error: any) {
    console.error("Stripe Connect Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
