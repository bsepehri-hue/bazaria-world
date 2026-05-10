export type UserProfile = {
  id: string;
  displayName: string;
  email: string;

  // Optional fields used in UI
  name?: string;
  bio?: string;
  avatarUrl?: string;
  walletAddress?: string;
  storefrontId?: string;

  // Required fields used in UI
  joinDate: Date;
  twoFactorEnabled: boolean;

  // Metadata
  createdAt: string;
};
