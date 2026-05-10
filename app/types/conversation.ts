// app/types/conversation.ts
export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  lastMessageTimestamp: Date;
}