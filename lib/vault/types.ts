/** Represents a single financial transaction in the user's ledger. */
export interface Transaction {
  id: string;
  type: "PAYOUT" | "EARNING" | "FEE" | "DEPOSIT";
  description: string;
  amount: number;       // normalized to number for charts
  token: "MATIC" | "ETH" | "USDC" | "LTB" | "WETH";
  timestamp: Date;
  txnHash: string;
}

/** Represents a single vault entry (balance record). */
export interface VaultEntry {
  id: string;
  stewardId: string;
  amount: number;
  currency: string;
  createdAt: Date;
}

/** Aggregated financial summary for the vault. */
export interface VaultSummary {
  totalBalance: number;
  currency: string;
  entries: VaultEntry[];
}

/** Line chart point for merchant net value */
export interface MerchantPoint {
  date: string;
  netValue: number;
}

/** Pie chart slice for referral discounts */
export interface ReferralSlice {
  label: string;
  value: number;
}

/** Bar chart datum for vault balances */
export interface VaultDatum {
  vaultId: string;
  amount: number;
}

/** Unified interface for Vault Dashboard */
export interface VaultDashboardData {
  summary: VaultSummary;
  transactions: Transaction[];
  merchantData: MerchantPoint[];
  referralData: ReferralSlice[];
  vaultData: VaultDatum[];
}