import { shortenAddress, formatEther } from "@/lib/utils";
import { UserPlus, DollarSign, Gavel, Clock, ArrowDownLeft } from "lucide-react";

// --- Type Definitions ---

export type ReferralActivityType = 'SIGNUP' | 'BID' | 'LISTING_FEE' | 'PAYOUT_CLAIM';

export interface ReferralStats {
  totalReferrals: number;
  totalEarnings: bigint; // Total earnings in WETH/ETH
  pendingEarnings: bigint; // Earnings locked until settlement
  paidEarnings: bigint; // Earnings already paid out
}

export interface ReferralActivity {
  id: string;
  type: ReferralActivityType;
  description: string;
  amountEarned: bigint;
  timestamp: Date;
  referralId: string; // Wallet address of the user who referred
}

// --- Mock Data ---

const now = Date.now();
const oneEth = BigInt('1000000000000000000');
const pointZeroFiveEth = BigInt('50000000000000000'); // 0.05 ETH

export const mockReferralStats: ReferralStats = {
  totalReferrals: 42,
  totalEarnings: oneEth * BigInt(7), // 7 ETH total earned
  pendingEarnings: pointZeroFiveEth * BigInt(30), // 1.5 ETH pending
  paidEarnings: oneEth * BigInt(5) + pointZeroFiveEth * BigInt(10), // 5.5 ETH paid
};

export const mockReferralActivity: ReferralActivity[] = [
  {
    id: 'ref_act_001',
    type: 'BID',
    description: 'Earned fee from bid on Auction #102',
    amountEarned: pointZeroFiveEth * BigInt(3), // 0.15 ETH
    timestamp: new Date(now - 3600000 * 1), // 1 hour ago
    referralId: shortenAddress('0xBuyerAddr0123456789'),
  },
  {
    id: 'ref_act_002',
    type: 'LISTING_FEE',
    description: 'Earned fee from new storefront listing (#10)',
    amountEarned: pointZeroFiveEth * BigInt(5), // 0.25 ETH
    timestamp: new Date(now - 3600000 * 5), // 5 hours ago
    referralId: shortenAddress('0xStorefrontAddrABCDEF'),
  },
  {
    id: 'ref_act_003',
    type: 'SIGNUP',
    description: 'Referral signup bonus earned',
    amountEarned: pointZeroFiveEth * BigInt(1), // 0.05 ETH
    timestamp: new Date(now - 86400000 * 1), // 1 day ago
    referralId: shortenAddress('0xNewUserAddr12345678'),
  },
  {
    id: 'ref_act_004',
    type: 'BID',
    description: 'Earned fee from winning bid on Auction #110',
    amountEarned: pointZeroFiveEth * BigInt(8), // 0.40 ETH
    timestamp: new Date(now - 86400000 * 3), // 3 days ago
    referralId: shortenAddress('0xWinningBidder98765'),
  },
];

/** Utility to get the appropriate icon for activity type */
export function getReferralActivityIcon(type: ReferralActivityType) {
    switch (type) {
      case 'SIGNUP':
        return UserPlus;
      case 'BID':
        return Gavel;
      case 'LISTING_FEE':
        return DollarSign;
      case 'PAYOUT_CLAIM':
        return Clock;
      default:
        return ArrowDownLeft; 
    }
}
