export interface Conversation {
  id: string;
  participants: string[];   // ⭐ Add this line
  lastMessage: string;
  lastMessageTimestamp: Date;
  unreadCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

export const mockConversations: Conversation[] = [
  {
    id: "convo_1",
    participants: ["user_123", "user_456"],
    lastMessage: "Hey, are you still selling the item?",
    lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unreadCount: 1,
  },
  {
    id: "convo_2",
    participants: ["user_123", "user_789"],
    lastMessage: "Thanks! I'll pick it up tomorrow.",
    lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    unreadCount: 0,
  },
  {
    id: "convo_3",
    participants: ["user_123", "user_999"],
    lastMessage: "Can you send more photos?",
    lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 3,
  },
];


export const mockMessageMap: Record<string, Message[]> = {};
export const CURRENT_USER_ID = "user_123";
export const CURRENT_USER_NAME = "Babak";
