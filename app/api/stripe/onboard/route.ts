import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', 
});

export async function POST(req: Request) {
  try {
    // 1. Create the Express Connected Account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // 2. Generate the secure onboarding link for this specific account
    // (Make sure NEXT_PUBLIC_BASE_URL is set in your .env, e.g., http://localhost:3000)
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/seller/refresh`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/seller/success`,
      type: 'account_onboarding',
    });

    // 3. Send the URL back to your frontend
    return NextResponse.json({ url: accountLink.url });
    
  } catch (error: any) {
    console.error("Stripe Onboarding Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
