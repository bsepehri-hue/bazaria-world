import { shortenAddress } from "@/lib/utils";

// --- Type Definitions ---

export interface AccountSettings {
  displayName: string;
  bio: string;
  language: 'en' | 'es' | 'fr';
}

export interface NotificationSettings {
  emailUpdates: boolean;
  bidAlerts: boolean;
  payoutAlerts: boolean;
  marketingEmails: boolean;
}

export interface PrivacySettings {
  showActivityFeed: boolean;
  allowDirectMessages: boolean;
  profileVisibility: 'public' | 'private';
}

export interface PayoutSettings {
  const payload: PayoutSettings = {
  preferredToken: formData.get("preferredToken") as string,
  frequency: formData.get("frequency") as 'daily' | 'weekly' | 'monthly',
}

export interface UserSettings {
  account: AccountSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  payouts: PayoutSettings;
}

// --- Mock Data ---

export const mockUserSettings: UserSettings = {
  account: {
    displayName: 'Vault Master',
    bio: 'Dedicated crypto enthusiast and proud storefront owner on ListToBid.',
    language: 'en',
  },
  notifications: {
    emailUpdates: true,
    bidAlerts: true,
    payoutAlerts: false,
    marketingEmails: false,
  },
  privacy: {
    showActivityFeed: true,
    allowDirectMessages: true,
    profileVisibility: 'public',
  },
  payouts: {
    preferredToken: shortenAddress('0x4200000000000000000000000000000000000006'), // Mock WETH
    frequency: 'weekly',
  },
};
