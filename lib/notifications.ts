import { Gavel, Wallet, ShoppingBag, AlertTriangle, MessageSquare } from 'lucide-react';
import { shortenAddress } from '@/lib/utils';

export interface Notification {
  id: string;
  type: 'BID' | 'PAYOUT' | 'LISTING' | 'ALERT' | 'MESSAGE';
  title: string;
  message: string;
  isRead: boolean;
  timestamp: Date;
  link?: string; // Link to the relevant auction, storefront, or transaction
}

/**
 * Returns the Lucide icon component based on the notification type.
 */
export function getNotificationIcon(type: Notification['type']) {
  switch (type) {
    case 'BID':
      return Gavel;
    case 'PAYOUT':
      return Wallet;
    case 'LISTING':
      return ShoppingBag;
    case 'ALERT':
      return AlertTriangle;
    case 'MESSAGE':
      return MessageSquare;
    default:
      return MessageSquare;
  }
}

// --- Mock Data ---

const now = Date.now();

export const mockNotifications: Notification[] = [
  {
    id: 'n_001',
    type: 'BID',
    title: 'New High Bid Placed!',
    message: `User ${shortenAddress('0x4D2C9D1E8F67B54C9A0F6F6D8C3E5F5A1B2C3D4E')} placed a bid of 1.25 ETH on Auction #102.`,
    isRead: false,
    timestamp: new Date(now - 60000 * 5), // 5 minutes ago
    link: '/auctions/102',
  },
  {
    id: 'n_002',
    type: 'PAYOUT',
    title: 'Payout Processed Successfully',
    message: 'Your payout request of 45 ETH has been processed and sent to your connected wallet.',
    isRead: false,
    timestamp: new Date(now - 60000 * 30), // 30 minutes ago
    link: '/dashboard/payouts',
  },
  {
    id: 'n_003',
    type: 'LISTING',
    title: 'Storefront Created',
    message: 'Your new storefront "Emily\'s Crafts" (ID #1) is now live and accepting listings.',
    isRead: true,
    timestamp: new Date(now - 3600000 * 2), // 2 hours ago
    link: '/dashboard/stores/1',
  },
  {
    id: 'n_004',
    type: 'ALERT',
    title: 'Low Balance Warning',
    message: 'Your vault balance is below 1 ETH. Ensure sufficient funds for fees.',
    isRead: true,
    timestamp: new Date(now - 3600000 * 5), // 5 hours ago
    link: '/dashboard/payouts',
  },
  {
    id: 'n_005',
    type: 'BID',
    title: 'You Were Outbid',
    message: `You were outbid on Auction #101. The new bid is 0.51 ETH.`,
    isRead: false,
    timestamp: new Date(now - 3600000 * 10), // 10 hours ago
    link: '/auctions/101',
  },
];
