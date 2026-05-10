import { db } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function logActivity(
  userId: string,
  type: string,
  description: string,
  link?: string
) {
  await addDoc(collection(db, "activity"), {
    userId,
    type,
    description,
    link: link || null,
    timestamp: serverTimestamp(),
  });
}
