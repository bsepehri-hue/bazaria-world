import { shortenAddress } from "@/lib/utils";

// --- Type Definitions ---

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  otherPartyId: string;
  otherPartyName: string;
  lastMessage: string;
  lastMessageTimestamp: Date;
  unreadCount: number;
}

// Mock User ID (representing the current logged-in user)
export const CURRENT_USER_ID = shortenAddress('0x2e0c2423c7b8C58Ff7E68a52914107F81B1537aB', 6);
export const CURRENT_USER_NAME = 'Store Owner Vault';

// --- Mock Data ---

const now = Date.now();
const oneHour = 3600000;

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    otherPartyId: shortenAddress('0x2e0c2423c7b8C58Ff7E68a52914107F81B1537aC', 6),
    otherPartyName: 'Emily Peters (Buyer)',
    lastMessage: 'I submitted a bid on the necklace. Can you confirm the token standard?',
    lastMessageTimestamp: new Date(now - oneHour * 1),
    unreadCount: 2,
  },
  {
    id: 'conv_2',
    otherPartyId: shortenAddress('0x4D2C9D1E8F67B54C9A0F6F6D8C3E5F5A1B2C3D4E', 6),
    otherPartyName: 'Admin Support',
    lastMessage: 'Your payout request is being processed. Expected time: 1-2 hours.',
    lastMessageTimestamp: new Date(now - oneHour * 5),
    unreadCount: 0,
  },
  {
    id: 'conv_3',
    otherPartyId: shortenAddress('0x5A6D7E81fA2bE5F6B9d1d4d8c7D72A9C0f3C9E4b', 6),
    otherPartyName: 'Jumper\'s Outfits Storefront',
    lastMessage: 'Do you want to cross-promote our new listings this week?',
    lastMessageTimestamp: new Date(now - oneHour * 20),
    unreadCount: 1,
  },
];

// Mock Messages for Conversation 1
export const mockMessagesConv1: Message[] = [
  {
    id: 'msg_1_1',
    senderId: '0x2e0c2423c7b8C58Ff7E68a52914107F81B1537aC',
    senderName: 'Emily Peters (Buyer)',
    content: 'Hello, I was looking at the "Rare Emerald Necklace" listing.',
    timestamp: new Date(now - oneHour * 3),
  },
  {
    id: 'msg_1_2',
    senderId: CURRENT_USER_ID,
    senderName: CURRENT_USER_NAME,
    content: 'Hi Emily, thanks for your interest! What questions do you have?',
    timestamp: new Date(now - oneHour * 2),
  },
  {
    id: 'msg_1_3',
    senderId: '0x2e0c2423c7b8C58Ff7E68a52914107F81B1537aC',
    senderName: 'Emily Peters (Buyer)',
    content: 'I submitted a bid on the necklace. Can you confirm the token standard?',
    timestamp: new Date(now - oneHour * 1),
  },
];

// Mock Messages for Conversation 2
export const mockMessagesConv2: Message[] = [
    {
        id: 'msg_2_1',
        senderId: '0x4D2C9D1E8F67B54C9A0F6F6D8C3E5F5A1B2C3D4E',
        senderName: 'Admin Support',
        content: 'Welcome to ListToBid support. How can we assist you with your payout?',
        timestamp: new Date(now - oneHour * 6),
    },
    {
        id: 'msg_2_2',
        senderId: CURRENT_USER_ID,
        senderName: CURRENT_USER_NAME,
        content: 'I requested a payout of 45 ETH three days ago. Could you provide an update on the status?',
        timestamp: new Date(now - oneHour * 5.5),
    },
    {
        id: 'msg_2_3',
        senderId: '0x4D2C9D1E8F67B54C9A0F6F6D8C3E5F5A1B2C3D4E',
        senderName: 'Admin Support',
        content: 'Your payout request is being processed. Expected time: 1-2 hours.',
        timestamp: new Date(now - oneHour * 5),
    },
];

// Map for quick retrieval in server actions
export const mockMessageMap: Record<string, Message[]> = {
  'conv_1': mockMessagesConv1,
  'conv_2': mockMessagesConv2,
  // Add an empty array for a new convo
  'conv_3': [], 
};
