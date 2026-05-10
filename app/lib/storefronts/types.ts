// src/storefronts/types.ts

/**
 * Core storefront type definition.
 * Extend this as you add more fields (fees, referral hooks, analytics, etc.).
 */
export interface Storefront {
  id: string;            // Unique storefront ID
  name: string;          // Storefront name
  ownerId: string;       // Wallet or user ID of the owner
  ownerName: string;     // Human-readable owner name
  description?: string;  // Optional description
  createdAt: Date;       // Creation timestamp
}
