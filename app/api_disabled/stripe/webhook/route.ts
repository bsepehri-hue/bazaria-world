import { NextResponse } from "next/server";
import Stripe from "stripe";
import { writeTimelineEvent } from "@/app/actions/writeTimelineEvent";
import { ensureVault, applyVaultDelta } from "@/app/lib/vault";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",

});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    // ---------------------------------------------------------
    // PAYMENT COMPLETED
    // ---------------------------------------------------------
    case "payment_intent.succeeded": {
      const pi = event.data.object;

      const amount = pi.amount_received / 100;
      const sellerId = pi.metadata.sellerId;

      await applyVaultDelta(sellerId, {
        available: amount,
        totalEarned: amount,
      });

      await writeTimelineEvent("sales", {
        type: "sale",
        label: `Payment completed: $${amount}`,
        amount,
        buyerId: pi.metadata.buyerId,
        sellerId,
        contextId: pi.metadata.contextId,
      });

      break;
    }

    // ---------------------------------------------------------
    // REFUND COMPLETED
    // ---------------------------------------------------------
    case "charge.refunded": {
      const charge = event.data.object;

      const amount = charge.amount_refunded / 100;
      const sellerId = charge.metadata.sellerId;

      await applyVaultDelta(sellerId, {
        available: -amount,
        totalRefunded: amount,
      });

      await writeTimelineEvent("refunds", {
        type: "refund",
        label: `Refund completed: $${amount}`,
        amount,
        buyerId: charge.metadata.buyerId,
        sellerId,
      });

      break;
    }

    // ---------------------------------------------------------
    // PAYOUT COMPLETED
    // ---------------------------------------------------------
    case "payout.paid": {
      const payout = event.data.object;

      const amount = payout.amount / 100;
      const sellerId = payout.metadata?.sellerId;

if (!sellerId) {
  console.error("Missing sellerId in payout metadata");
  return new Response("Missing sellerId", { status: 400 });
}

await applyVaultDelta(sellerId, {
  available: -amount,
  totalPayouts: amount,
});



      await writeTimelineEvent("payouts", {
        type: "payout",
        label: `Payout sent: $${amount}`,
        amount,
        sellerId,
      });

      break;
    }

    // ---------------------------------------------------------
    // ACCOUNT UPDATED
    // ---------------------------------------------------------
    case "account.updated": {
      const acct = event.data.object;

      await writeTimelineEvent("systemEvents", {
        type: "system",
        label: `Stripe account updated`,
        merchantId: acct.id,
      });

      break;
    }

    // ---------------------------------------------------------
    // DISPUTE EVENTS (ALL 4 CASES)
    // ---------------------------------------------------------

    // 1️⃣ DISPUTE OPENED
    case "charge.dispute.created": {
      const dispute = event.data.object;

      const amount = dispute.amount / 100;
      const sellerId = dispute.metadata.sellerId;

      await applyVaultDelta(sellerId, {
        locked: amount,
      });

      await writeTimelineEvent("disputes", {
        type: "dispute",
        label: `Dispute opened: $${amount}`,
        amount,
        buyerId: dispute.metadata.buyerId,
        sellerId,
        contextId: dispute.metadata.contextId,
      });

      break;
    }

    // 2️⃣ DISPUTE LOST (FUNDS WITHDRAWN)
    case "charge.dispute.funds_withdrawn": {
      const dispute = event.data.object;

      const amount = dispute.amount / 100;
      const sellerId = dispute.metadata.sellerId;

      await applyVaultDelta(sellerId, {
        available: -amount,
        locked: -amount,
      });

      await writeTimelineEvent("disputes", {
        type: "dispute",
        label: `Dispute lost: $${amount}`,
        amount,
        buyerId: dispute.metadata.buyerId,
        sellerId,
        contextId: dispute.metadata.contextId,
      });

      break;
    }

    // 3️⃣ DISPUTE WON (FUNDS REINSTATED)
    case "charge.dispute.funds_reinstated": {
      const dispute = event.data.object;

      const amount = dispute.amount / 100;
      const sellerId = dispute.metadata.sellerId;

      await applyVaultDelta(sellerId, {
        available: amount,
        locked: -amount,
      });

      await writeTimelineEvent("disputes", {
        type: "dispute",
        label: `Dispute won: $${amount}`,
        amount,
        buyerId: dispute.metadata.buyerId,
        sellerId,
        contextId: dispute.metadata.contextId,
      });

      break;
    }

    // 4️⃣ DISPUTE CLOSED (NO MONEY MOVEMENT)
    case "charge.dispute.closed": {
      const dispute = event.data.object;

      await writeTimelineEvent("disputes", {
        type: "dispute",
        label: `Dispute closed`,
        buyerId: dispute.metadata.buyerId,
        sellerId: dispute.metadata.sellerId,
        contextId: dispute.metadata.contextId,
      });

      break;
    }

    // ---------------------------------------------------------
    // END DISPUTE EVENTS
    // ---------------------------------------------------------

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
