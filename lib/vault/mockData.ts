import {
  VaultEntry,
  VaultSummary,
  Transaction,
  MerchantPoint,
  ReferralSlice,
  VaultDatum,
  VaultDashboardData,
} from "./types";

const now = Date.now();

export const mockVaultEntries: VaultEntry[] = [
  { id: "v-001", stewardId: "0x1234...ABCD", amount: 500, currency: "USD", createdAt: new Date("2025-01-01") },
  { id: "v-002", stewardId: "0x5678...EFGH", amount: 1200, currency: "USD", createdAt: new Date("2025-02-01") },
  { id: "v-003", stewardId: "0x9999...ZZZZ", amount: 300, currency: "USD", createdAt: new Date("2025-03-01") },
];

export const mockVaultSummary: VaultSummary = {
  totalBalance: mockVaultEntries.reduce((sum, e) => sum + e.amount, 0),
  currency: "USD",
  entries: mockVaultEntries,
};

export const mockTransactionLedger = [
  {
    id: "txn_001",
    type: "EARNING",
    description: "Auction #101 Sale - Rare Emerald Necklace",
    amount: 50,
    token: "WETH",
    timestamp: new Date(now - 86400000 * 2),
    txnHash: "0xabc123456789def0123456789abcde",
  },
  {
    id: "txn_002",
    type: "PAYOUT",
    description: "Wallet Payout Request",
    amount: -25,
    token: "ETH",
    timestamp: new Date(now - 86400000 * 5),
    txnHash: "0xdef0123456789abcde123456789abc12",
  },
] as const satisfies Transaction[];

export const mockMerchantData: MerchantPoint[] = [
  { date: "12/01/2025", netValue: 500 },
  { date: "12/05/2025", netValue: 1200 },
];

export const mockReferralData: ReferralSlice[] = [
  { label: "Discounts", value: 40 },
  { label: "Full Price", value: 60 },
];

export const mockVaultData: VaultDatum[] = [
  { vaultId: "Vault A", amount: 500 },
  { vaultId: "Vault B", amount: 1200 },
];

export const mockVaultDashboardData: VaultDashboardData = {
  summary: mockVaultSummary,
  transactions: mockTransactionLedger,
  merchantData: mockMerchantData,
  referralData: mockReferralData,
  vaultData: mockVaultData,
};
