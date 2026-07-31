import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getFirestore } from "firebase-admin/firestore";
import { initAdmin } from "@/lib/firebase/admin"; // Adjust this import if your admin init is located elsewhere!

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    await initAdmin(); // Initialize Firebase Admin
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
      
      // If Stripe says they are done, tell the frontend to lock the button!
      if (account.details_submitted) {
        return NextResponse.json({ verified: true, stripeAccountId });
      }
    }

    // 4. Generate the onboarding link (Handles both brand new accounts AND abandoned sessions)
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/rewards`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/rewards`,
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
