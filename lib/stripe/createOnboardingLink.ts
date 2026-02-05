import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
 apiVersion: "2025-12-15.clover",


});

/**
 * Create an onboarding link for a connected account.
 */
export async function createOnboardingLink(accountId: string) {
  return await stripe.accountLinks.create({
    account: accountId,
    refresh_url: "https://yourapp.com/reauth",
    return_url: "https://yourapp.com/return",
    type: "account_onboarding",
  });
}
