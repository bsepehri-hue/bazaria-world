import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe using your secure environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10", 
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { agentUid, email } = body;

    if (!agentUid) {
      return NextResponse.json({ error: "Agent ID is required" }, { status: 400 });
    }

   // 1. Create the Custom Connected Account
    const account = await stripe.accounts.create({
      type: "custom",
      country: "US", 
      email: email,
      capabilities: {
        // card_issuing: { requested: true }, <-- Temporarily disabled
        transfers: { requested: true },
      },
    });

    // 2. Generate the secure Stripe-hosted onboarding link
    // We dynamically grab your website's URL so it works in both local testing and production
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${baseUrl}/rewards?setup=refresh`,
      return_url: `${baseUrl}/rewards?setup=success`,
      type: "account_onboarding",
    });

    // 3. Send the secure URL and the new Account ID back to your frontend
    return NextResponse.json({ 
      success: true,
      url: accountLink.url,
      stripeAccountId: account.id 
    });

  } catch (error: any) {
    console.error("Stripe Connect Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
