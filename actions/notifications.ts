"use server";

import { db } from "@/lib/firebase/server";
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
}

export async function markNotificationsAsRead(ids: string[]) {
  for (const id of ids) {
    await updateDoc(doc(db, "notifications", id), { read: true });
  }
  return true;
}
