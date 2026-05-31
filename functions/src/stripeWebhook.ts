import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";
import { Request, Response } from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover" as any,
});

// 🎯 Named function structure forces absolute void assignment across all compiler versions
async function handleStripeWebhook(req: functions.https.Request, res: Response): Promise<void> {

  try {
    const sig = req.headers["stripe-signature"]!;
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return; 
  }

  const db = admin.firestore();

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object;
      const paymentId = pi.metadata.paymentId;

      const ref = db.collection("paymentIntents").doc(paymentId);
      await ref.update({
        status: "paid",
        chargeId: (pi as any).latest_charge || null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      const vaultRef = await db.collection("vault").add({
        paymentId,
        sellerId: pi.metadata.sellerId,
        amount: pi.amount_received / 100,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      await ref.update({
        vaultEntryId: vaultRef.id,
      });

      res.status(200).send("OK");
      return; 
    }

    case "payment_intent.payment_failed": {
      const pi = event.data.object;
      const paymentId = pi.metadata.paymentId;

      await db.collection("paymentIntents").doc(paymentId).update({
        status: "failed",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).send("OK");
      return; 
    }

    case "payment_intent.requires_action": {
      const pi = event.data.object;
      const paymentId = pi.metadata.paymentId;

      await db.collection("paymentIntents").doc(paymentId).update({
        status: "requires_action",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).send("OK");
      return; 
    }

    default: {
      res.status(200).send("Unhandled event");
      return; 
    }
  }
}

// 📡 Pass the named void function explicitly into the Firebase trigger shell
export const stripeWebhook = functions.https.onRequest(handleStripeWebhook);
