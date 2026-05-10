import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function writeTimelineEvent(source: string, data: any) {
  try {
    await addDoc(collection(db, source), {
      ...data,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("Error writing timeline event:", err);
  }
}
