import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any, 
});

// ⚡ CRITICAL: Force Next.js to treat this route as purely dynamic and raw
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;

 try {
    const rawBody = await req.text();
    
    // ⚡ DEV FALLBACK ENGINE: Bypass signature verification when testing locally
    if (process.env.NODE_ENV === "development" && (!sig || sig === "mock_signature")) {
      console.log("🛠️ Local Development Environment Detected: Staging Mock Webhook Session...");
      
      event = {
        id: "evt_test_local",
        object: "event",
        api_version: "2023-10-16",
        created: Math.floor(Date.now() / 1000),
        type: "payment_intent.succeeded", // 👈 Change this string to test different states!
        data: {
          object: {
            id: "pi_mock_test_123",
            object: "payment_intent",
            status: "succeeded",
            amount: 13964, // Simulating a $139.64 cart value
          } as any
        },
        livemode: false
      };
    } else {
      // Production path: Requires real cloud signature authentication from Stripe
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    }
  } catch (err: any) {
    console.error(`❌ Webhook Signature Verification Failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log(`📡 STRIPE WEBHOOK RECEIVED: ${event.type}`);

  // Handle the asynchronous payment lifecycle events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // If the user paid via Card/Apple Pay/Google Pay, payment_status is 'paid' immediately
      if (session.payment_status === "paid") {
        await fulfillOrder(session);
      } else {
        // 🏦 If paid via ACH, payment_status is 'unpaid' initially (pending processing)
        await stagePendingEscrowOrder(session);
      }
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`💰 PaymentIntent Succeeded for ${paymentIntent.id}. Clear funds secured!`);
      
      // ⚡ Unlock the sovereign assets in your database here!
      await confirmAndUnlockAssets(paymentIntent.id);
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.error(`❌ Bank Payment Failed/Bounced for ${paymentIntent.id}`);
      
      // 🛑 Flag the transaction order as failed/canceled due to non-sufficient funds
      await handleFailedPayment(paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

// 🦾 PLACEHOLDER DB INTERACTION LOGIC FUNCTIONS TO INTEGRATE INTO YOUR DATABASE LAYER:

async function stagePendingEscrowOrder(session: Stripe.Checkout.Session) {
  console.log(`🏦 ACH Order staged in pending status. Holding allocation for: ${session.id}`);
  // TODO: Insert row into your orders database with status = "PENDING_BANK_CLEARANCE"
}

async function fulfillOrder(session: Stripe.Checkout.Session) {
  console.log(`⚡ Instant Fulfillment executing for card/biometric payment: ${session.id}`);
  // TODO: Allocate sovereign ledger assets to inventory balance right now
}

async function confirmAndUnlockAssets(paymentIntentId: string) {
  console.log(`🔓 Releasing assets from escrow sandbox for PaymentIntent: ${paymentIntentId}`);
  // TODO: Find order by paymentIntentId, update status = "COMPLETED", unlock item inventory
}

async function handleFailedPayment(paymentIntentId: string) {
  console.log(`🛑 Canceling pending order allocations for failed PaymentIntent: ${paymentIntentId}`);
  // TODO: Find order by paymentIntentId, update status = "FAILED_NSF", release asset back to market
}
