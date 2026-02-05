"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function MessageButton({
  sellerId,
  buyerId,
  contextType,
  contextId,
  label = "Message Seller",
}: {
  sellerId: string;
  buyerId: string;
  contextType: "listing" | "auction" | "service" | "storefront";
  contextId: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const openThread = async () => {
    setLoading(true);

    // 1. Check if thread already exists
    const ref = collection(db, "threads");

    const q = query(
      ref,
      where("participants", "array-contains", buyerId),
      where("contextType", "==", contextType),
      where("contextId", "==", contextId)
    );

    const snap = await getDocs(q);

    if (!snap.empty) {
      // Thread exists → open it
      const threadId = snap.docs[0].id;
      router.push(`/messages/${threadId}`);
      return;
    }

    // 2. Create new thread
    const newThread = await addDoc(collection(db, "threads"), {
      participants: [buyerId, sellerId],
      contextType,
      contextId,
      lastMessage: null,
      lastMessageAt: serverTimestamp(),
      unreadCountForA: 0,
      unreadCountForB: 0,
      createdAt: serverTimestamp(),
    });

    // 3. Redirect to thread
    router.push(`/messages/${newThread.id}`);
  };

  return (
    <button
      onClick={openThread}
      disabled={loading}
      className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
    >
      {loading ? "Loading…" : label}
    </button>
  );
}
