import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase/admin"; // 👈 Updated to adminDb!
import { revalidatePath } from 'next/cache';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any, 
});

// 🔒 CRITICAL: Lock this API route to the heavy Node.js backend runtime
export const runtime = "nodejs";

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
        type: "account.updated", 
        data: {
          object: {
            id: "acct_1Tz1OXRzjW5IN7qT",
            object: "account",
            charges_enabled: true,
            details_submitted: true
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
      
      // 1. Fulfillment (Database update)
      if (session.payment_status === "paid") {
        await fulfillOrder(session);
      } else {
        await stagePendingEscrowOrder(session);
      }

      // 2. ⚡ THE SPLIT: Transfer funds to the sellers (MULTI-VENDOR ENGINE)
      const orderId = session.metadata?.orderId;
      const cartRoutingRaw = session.metadata?.cartRouting;

      if (orderId && cartRoutingRaw) {
        try {
          // Parse the compressed cart array we sent from Phase 1
          const items = JSON.parse(cartRoutingRaw);

          // Loop through every item in the cart
          for (const item of items) {
            
            // Look up the exact storefront document using the ownerId
            const storeRef = adminDb.collection('storefronts').doc(item.ownerId);
            const storeSnap = await storeRef.get();

            if (storeSnap.exists) {
              const storeData = storeSnap.data();
              const destinationStripeId = storeData?.stripeAccountId;

              if (destinationStripeId) {
                // 🧮 Math: Convert item price to cents and calculate the 97% merchant cut
                const itemTotalCents = Math.round(Number(item.price) * 100);
                const merchantCutCents = Math.round(itemTotalCents * 0.97);

               // 1. First, retrieve the Payment Intent to get the exact Charge ID from the buyer
const paymentIntent = await stripe.paymentIntents.retrieve(
  session.payment_intent as string
);
const chargeId = paymentIntent.latest_charge as string;

// 🚀 Execute the transfer to the merchant's connected account
await stripe.transfers.create({
  amount: merchantCutCents,
  currency: 'usd',
  destination: destinationStripeId,
  source_transaction: chargeId, // 👈 THIS BYPASSES THE BALANCE LIMIT
  transfer_group: orderId, // Keeps it linked perfectly for your accounting
});
                
                console.log(`✅ Transferred ${merchantCutCents} cents to ${destinationStripeId} for item ${item.id}`);
              } else {
                console.warn(`⚠️ Storefront ${item.ownerId} is missing a Stripe Account ID.`);
              }
            } else {
              console.warn(`⚠️ Storefront document not found for ${item.ownerId}`);
            }
          }
        } catch (err) {
          console.error(`❌ Multi-vendor transfer failed for session ${session.id}:`, err);
        }
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

    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      console.log(`🏦 Stripe Account Updated: ${account.id}`);

      // Check if the agent has successfully completed the identity and bank routing requirements
      if (account.charges_enabled && account.details_submitted) {
        console.log(`✅ Agent account ${account.id} is fully verified and ready for payouts!`);
        
        // ⚡ Update the agent's status in Firestore
        await verifyAgentPayouts(account.id);
      } else {
        console.log(`⏳ Agent account ${account.id} is still pending verification.`);
      }
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
  console.log(`⚡ Instant Fulfillment executing for payment: ${session.id}`);
  
  const cartRoutingRaw = session.metadata?.cartRouting;
  const orderId = session.metadata?.orderId; // 👈 1. Grab the Order ID from Stripe

  if (cartRoutingRaw) {
    try {
      const items = JSON.parse(cartRoutingRaw);

      // Loop through every item the buyer just paid for (Your existing logic)
      for (const item of items) {
        const listingRef = adminDb.collection('listings').doc(item.id);
        
        // 🛡️ SOFT DELETE: Keeps the record but removes it from public view
        await listingRef.update({
          status: "sold",
          isActive: false,
          stock: 0 
        });

        console.log(`✅ Asset ${item.id} successfully marked as sold and secured in backend archives.`);

        if (item.ownerId) {
          revalidatePath(`/storefront/${item.ownerId}`);
        }
        revalidatePath(`/`);
      }
    } catch (error) {
      console.error("🔥 Error executing inventory fulfillment:", error);
    }
  }

  // 🚚 NEW: FEDEX LABEL GENERATION & ORDER DB UPDATE
  if (orderId) {
    try {
      const orderRef = adminDb.collection("orders").doc(orderId);
      const orderSnap = await orderRef.get();
      
      if (orderSnap.exists) {
        const orderData = orderSnap.data();
        
        // Ensure you have a base URL for the internal API call
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        
        // Call the internal FedEx Create Label Route we built earlier
        const labelResponse = await fetch(`${baseUrl}/api/shipping/create-label`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderId,
            buyerAddress: orderData?.fulfillment?.destination,
            sellerAddress: orderData?.fulfillment?.origin,
            items: orderData?.items,
            dropOffMethod: orderData?.fulfillment?.logisticsMethod
          })
        });

        const labelData = await labelResponse.json();

        if (labelData.success) {
          // Update the specific order document with the live tracking details
          await orderRef.update({
            "status": "PROCESSING",
            "fulfillment.trackingNumber": labelData.trackingNumber,
            "fulfillment.labelUrl": labelData.labelUrl,
            "fulfillment.shippingStatus": "LABEL_CREATED",
            "timestamps.updatedAt": new Date().toISOString()
          });
          
          console.log(`✅ Order ${orderId} successfully fulfilled and tracking attached!`);
        } else {
           console.error(`❌ FedEx Label failed for Order ${orderId}:`, labelData.error);
        }
      }
    } catch (error) {
       console.error("🔥 Error generating FedEx label and updating order:", error);
    }
  }
}
async function confirmAndUnlockAssets(paymentIntentId: string) {
  console.log(`🔓 Releasing assets from escrow sandbox for PaymentIntent: ${paymentIntentId}`);
  // TODO: Find order by paymentIntentId, update status = "COMPLETED", unlock item inventory
}

async function handleFailedPayment(paymentIntentId: string) {
  console.log(`🛑 Canceling pending order allocations for failed PaymentIntent: ${paymentIntentId}`);
  // TODO: Find order by paymentIntentId, update status = "FAILED_NSF", release asset back to market
}

async function verifyAgentPayouts(stripeAccountId: string) {
  console.log(`🔓 Initiating Firestore update for Stripe ID: ${stripeAccountId}`);
  
  try {
    const partnersRef = adminDb.collection('partners'); 
    const snapshot = await partnersRef.where('stripeAccountId', '==', stripeAccountId).get();

    if (snapshot.empty) {
      console.error(`❌ Could not find partner matching Stripe ID: ${stripeAccountId}`);
      return;
    }

    snapshot.forEach(async (doc) => {
      await doc.ref.update({
        payoutStatus: "verified", 
        identityVerified: true,
        onboardingCompletedAt: new Date().toISOString()
      });
      console.log(`🎯 Successfully verified payouts for partner UID: ${doc.id}`);
    });

  } catch (error) {
    console.error("🔥 Error updating partner payout status:", error);
  }
}
