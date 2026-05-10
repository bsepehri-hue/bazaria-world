import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-12-15.clover",
});


/**
 * Retrieve the status of a connected account.
 */
export async function getAccountStatus(accountId: string) {
  return await stripe.accounts.retrieve(accountId);
}
