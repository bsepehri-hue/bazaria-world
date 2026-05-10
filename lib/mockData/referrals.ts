export interface ReferralStats {
  totalReferrals: number;
  totalEarnings: bigint;
  pendingEarnings: bigint;
  paidEarnings: bigint;
}

export interface ReferralActivity {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export async function getReferralStats(stewardId: string): Promise<ReferralStats> {
  return {
    totalReferrals: 0,
    totalEarnings: BigInt(0),
    pendingEarnings: BigInt(0),
    paidEarnings: BigInt(0),
  };
}

export async function getReferralActivity(stewardId: string): Promise<ReferralActivity[]> {
  return [];
}
