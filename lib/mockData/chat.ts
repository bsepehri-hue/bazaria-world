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

export const mockConversations: Conversation[] = [ /* ... */ ];
export const mockMessageMap: Record<string, Message[]> = {};
export const CURRENT_USER_ID = "user_123";
export const CURRENT_USER_NAME = "Babak";
