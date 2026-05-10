import { formatEther as ethersFormatEther } from "ethers";

/**
 * Shortens a wallet address for display (e.g., 0x1234...ABCD)
 */
export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return "";
  const prefix = address.substring(0, chars + 2); // Includes '0x'
  const suffix = address.substring(address.length - chars);
  return `${prefix}...${suffix}`;
};

/**
 * Formats a Wei value (string or bigint) into an Ether string using ethers.js.
 */
export const formatEther = (weiValue?: string | bigint): string => {
  try {
    if (weiValue === undefined) return "0.00";
    const value = typeof weiValue === "string" ? BigInt(weiValue) : weiValue;
    return ethersFormatEther(value);
  } catch {
    return "0.00";
  }
};

/**
 * Formats a Wei value (string or bigint) into Ether string with 2 decimal places.
 * Example: 500000000000000000 -> "0.50"
 */
export const formatEtherShort = (weiValue?: string | bigint): string => {
  try {
    if (weiValue === undefined) return "0.00";
    const value = typeof weiValue === "string" ? BigInt(weiValue) : weiValue;
    const ether = Number(ethersFormatEther(value));
    return ether.toFixed(2);
  } catch {
    return "0.00";
  }
};

/**
 * Formats a duration in milliseconds into a human-readable string.
 * Example: 3661000 -> "1h 1m 1s"
 */
export const formatDuration = (ms: number): string => {
  if (ms <= 0) return "0s";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(" ");
};

/**
 * Generates a shareable URL for an auction listing, optionally including a referral address.
 */
export function generateShareableAuctionLink(
  auctionId: string | bigint,
  refAddress?: string
): string {
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/auctions/${auctionId}`
      : `https://listtobid.com/auctions/${auctionId}`;

  const url = new URL(baseUrl);

  if (refAddress) {
    url.searchParams.set("ref", refAddress);
  }

  return url.toString();
}

// ============================================================================
// 🧬 X-ID COGNITIVE LINEAGE ENGINE (Codex Parts 1 - 5)
// ============================================================================

/**
 * 🏷️ Section 1: Standardized Structural Prefixes (Parts 2 & 3 Taxonomy)
 */
export type XidType =
  | "STR"  // Steward (Listing Agent / Success Partner)
  | "MRC"  // Merchant
  | "USR"  // Buyer/User
  | "STF"  // Storefront Object
  | "PRD"  // Product / Listing Object
  | "SAL"  // Sale Cycle Anchor (Core Gravity Well)
  | "PO"   // Purchase Order Cycle
  | "SHP"  // Shipping Cycle
  | "RMA"  // Return Merchandise Authorization Cycle
  | "CRD"  // Credit/Refund Cycle
  | "FEE"  // Financial Event: Fees
  | "RSD"  // Financial Event: Residuals / Commission Splits
  | "TRU"  // Trust Event / Dispute / Audit Logs
  | "RFL"  // Referral Event
  | "INQ"  // Inquiry / Lead Event
  | "CHV"; // Chat / Communication Sibling Event

/**
 * 🧬 Section 2: Universal Ancestry Chain Structure (Parts 2 - 5 Compliance)
 */
export interface XidChain {
  self: string;                 // The unique immutable identifier of this entity
  parent: string | null;        // Vertical lineage (Origin / Ownership ancestor)
  siblings: string[];           // Horizontal lineage (Siblings in the same operational cycle)
  cross_links: string[];        // Cross-lineage relationships (Non-hierarchical impacts)
  vault_links?: {               // Part 5 Navigation Matrix (The Interactive Chamber)
    panel: "EarningsLineage" | "ReferralConstellation" | "TrustLedger" | "PlatformFees" | "StewardResiduals";
    targetXid: string;
  }[];
}

/**
 * ⚙️ Generates an immutable, prefix-anchored X-ID using millisecond epoch precision
 * and a 5-character high-entropy cryptographic suffix fallback.
 * * Example output: "PRD-1778392102-X8FA3"
 */
export const generateXid = (type: XidType): string => {
  const epoch = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${type}-${epoch}-${randomSuffix}`;
};

/**
 * 🛠️ Compiler: Assembles an immutable Lineage Chain block matching the rules of the Codex.
 * This guarantees that every transactional object or event in the database carries
 * its complete ancestral history.
 */
export const createLineageBlock = (params: {
  type: XidType;
  parent?: string | null;
  siblings?: string[];
  cross_links?: string[];
  vault_links?: {
    panel: "EarningsLineage" | "ReferralConstellation" | "TrustLedger" | "PlatformFees" | "StewardResiduals";
    targetXid: string;
  }[];
}): XidChain => {
  return {
    self: generateXid(params.type),
    parent: params.parent || null,
    siblings: params.siblings || [],
    cross_links: params.cross_links || [],
    vault_links: params.vault_links || []
  };
};

/**
 * 🔎 Suffix Extractor: Extracts the 5-digit product reference code from an X-ID 
 * to display clean public-facing IDs (Rule 6: Never expose raw X-IDs publicly).
 * * Example: "PRD-1778392102-C78F2" -> "C78F2"
 */
export const getProductCode = (xid?: string | null): string => {
  if (!xid) return "GENERAL";
  const parts = xid.split("-");
  return parts[parts.length - 1] || "GENERAL";
};
