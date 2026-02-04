"use server";

import { ReferralStats, ReferralActivity, mockReferralStats, mockReferralActivity } from '@/lib/mockData/referrals';
import { revalidatePath } from 'next/cache';

// Mock state management (in a real app, this would hit Firestore/DB)
let currentReferralStats: ReferralStats = { ...mockReferralStats };
let currentReferralActivity: ReferralActivity[] = [...mockReferralActivity];

/**
 * Server Action to fetch the current user's aggregated referral statistics.
 */
export async function getReferralStats(): Promise<ReferralStats> {
  // In a real app: fetch aggregated stats based on user ID
  return currentReferralStats;
}

/**
 * Server Action to fetch the latest referral activity ledger.
 */
export async function getReferralActivity(): Promise<ReferralActivity[]> {
  // In a real app: fetch recent activity linked to the user's referral code
  return currentReferralActivity.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// NOTE: No update action needed yet, as link generation is handled client-side
// and payout claims would likely be part of the general Vault/Payout actions.