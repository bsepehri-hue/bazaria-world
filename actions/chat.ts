// actions/chat.ts

// Send a message (stubbed for now)
export async function sendMessage(message: string) {
  console.log("sendMessage called:", message);
}

// Fetch conversations (placeholder)
export async function fetchConversations() {
  return [];
}

// ✅ Add missing exports so imports resolve

// Alias for fetchConversations, since some pages import getConversations
export async function getConversations() {
  return await fetchConversations();
}

// Stub for fetching messages in a conversation
export async function getMessages(conversationId: string) {
  // Replace with Firestore query later
  return [];
}