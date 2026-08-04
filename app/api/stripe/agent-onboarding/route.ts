import { NextResponse } from "next/server";
import Stripe from "stripe";
import "@/lib/firebase/admin";
import { getFirestore } from "firebase-admin/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const db = getFirestore();
    const { agentUid, email } = await req.json();

    if (!agentUid) {
      return NextResponse.json({ error: "Missing Agent UID" }, { status: 400 });
    }

    // 1. Check if the agent already has a Stripe ID saved
    const agentRef = db.collection("partners").doc(agentUid);
    const agentDoc = await agentRef.get();
    let stripeAccountId = agentDoc.data()?.stripeAccountId;

    // 2. If NO ID exists, create a brand new Stripe Custom/Express account
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: email,
        capabilities: {
          transfers: { requested: true },
        },
      });
      stripeAccountId = account.id;
    } else {
      // 3. If ID EXISTS, check their live verification status
      const account = await stripe.accounts.retrieve(stripeAccountId);
      
      if (account.details_submitted) {
        return NextResponse.json({ verified: true, stripeAccountId });
      }
    }

    // 🛡️ THE FIX: Create a bulletproof Base URL fallback
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // 4. Generate the onboarding link using the safe baseUrl
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${baseUrl}/rewards`,
      return_url: `${baseUrl}/rewards`,
      type: "account_onboarding",
    });

    return NextResponse.json({ 
      url: accountLink.url,
      stripeAccountId: stripeAccountId 
    });

  } catch (error: any) {
    console.error("Stripe Onboarding Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
