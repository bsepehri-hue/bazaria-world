import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"]!;
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const db = admin.firestore();

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object;
      const paymentId = pi.metadata.paymentId;

      const ref = db.collection("paymentIntents").doc(paymentId);
      await ref.update({
        status: "paid",
        chargeId: pi.charges.data[0]?.id || null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Create Vault entry
      const vaultRef = await db.collection("vault").add({
        paymentId,
        sellerId: pi.metadata.sellerId,
        amount: pi.amount_received / 100,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Link vault entry to paymentIntent
      await ref.update({
        vaultEntryId: vaultRef.id,
      });

      return res.status(200).send("OK");
    }

    case "payment_intent.payment_failed": {
      const pi = event.data.object;
      const paymentId = pi.metadata.paymentId;

      await db.collection("paymentIntents").doc(paymentId).update({
        status: "failed",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(200).send("OK");
    }

    case "payment_intent.requires_action": {
      const pi = event.data.object;
      const paymentId = pi.metadata.paymentId;

      await db.collection("paymentIntents").doc(paymentId).update({
        status: "requires_action",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(200).send("OK");
    }

    default:
      return res.status(200).send("Unhandled event");
  }
});