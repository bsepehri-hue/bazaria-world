import { addDoc, collection, doc, serverTimestamp, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function sendMessage({
  threadId,
  senderId,
  text,
  buyerId,
  storeId,
}: {
  threadId: string;
  senderId: string;
  text: string;
  buyerId: string;
  storeId: string;
}) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const messagesRef = collection(db, "messages");

  await addDoc(messagesRef, {
    threadId,
    senderId,
    text: trimmed,
    createdAt: serverTimestamp(),
    readByBuyer: senderId === buyerId,
    readBySeller: senderId !== buyerId,
  });

  const threadRef = doc(db, "threads", threadId);

  const unreadField =
    senderId === buyerId ? "unreadForSeller" : "unreadForBuyer";

  await updateDoc(threadRef, {
    lastMessage: trimmed,
    lastMessageAt: serverTimestamp(),
    [unreadField]: increment(1),
  });
}
