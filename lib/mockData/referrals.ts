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

export const mockReferralStats: ReferralStats = {
  total: 0,
  pending: 0,
  completed: 0,
  earnings: 0,
};

export const mockReferralActivity: ReferralActivity[] = [];
