"use server";

import { redirect } from 'next/navigation';

const STRIPE_MOCK_CLIENT_ID = "ca_mockedClientIdForListToBid";
const STRIPE_MOCK_BASE_URL = "https://mock-stripe.com/connect";

/**
 * Mocks the generation of a Stripe Connect Onboarding Link.
 * This is where you would securely call the Stripe Node.js library 
 * to create an Account Link object.
 * @param userId The ID of the user (or the Connect Account ID)
 */
export async function createStripeOnboardingLink(userId: string) {
  // 1. Server-Side Check: Check if a Stripe Account ID exists for this userId in your database.
  //    If not, create the Stripe Account first, then generate the link.
  
  // MOCK: Assume we successfully generated the account link URL
  const mockAccountId = `acct_${userId.slice(0, 10)}`;
  const onboardingUrl = `${STRIPE_MOCK_BASE_URL}/onboard?account=${mockAccountId}&response_type=code&client_id=${STRIPE_MOCK_CLIENT_ID}&scope=read_write&redirect_uri=${encodeURIComponent('http://localhost:3000/dashboard/payouts')}`;

  console.log(`[Stripe Action] Generated Onboarding Link for user ${userId}: ${onboardingUrl}`);

  // 2. Redirect the user immediately to the Stripe URL
  redirect(onboardingUrl);
}

/**
 * Mocks the generation of a Stripe Account Settings Link.
 * This allows the connected seller to update bank details, tax info, etc.
 * @param stripeAccountId The seller's existing Stripe Account ID.
 */
export async function createStripeSettingsLink(stripeAccountId: string) {
  // 1. Server-Side Check: Ensure the stripeAccountId is valid and belongs to the user.
  
  // MOCK: Assume we successfully generated the settings link URL
  const settingsUrl = `${STRIPE_MOCK_BASE_URL}/settings/${stripeAccountId}?redirect_uri=${encodeURIComponent('http://localhost:3000/dashboard/payouts')}`;
  
  console.log(`[Stripe Action] Generated Settings Link for account ${stripeAccountId}: ${settingsUrl}`);

  // 2. Redirect the user immediately to the Stripe URL
  redirect(settingsUrl);
}