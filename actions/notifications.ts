"use server";

import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

export async function getNotifications(userId: string) {
  const ref = collection(db, "notifications");
  const q = query(ref, where("userId", "==", userId));

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
  id: d.id,
  ...(d.data() as any),
}));

export async function markNotificationsAsRead(userId: string) {
  const ref = collection(db, "notifications");
  const q = query(ref, where("userId", "==", userId));

  const snap = await getDocs(q);

  for (const d of snap.docs) {
    await updateDoc(doc(db, "notifications", d.id), { read: true });
  }

  return true;
}
