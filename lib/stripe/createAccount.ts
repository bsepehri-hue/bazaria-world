import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-11-01",

});

/**
 * Create a new connected account.
 */
export async function createAccount() {
  return await stripe.accounts.create({
    type: "express",
  });
}
