
export interface ReferralStats {
  total: number;
  pending: number;
  completed: number;
  earnings: number;
}

export interface ReferralActivity {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export async function getReferralStats(stewardId: string): Promise<ReferralStats> {
  return {
    total: 0,
    pending: 0,
    completed: 0,
    earnings: 0,
  };
}

export async function getReferralActivity(stewardId: string): Promise<ReferralActivity[]> {
  return [];
}
