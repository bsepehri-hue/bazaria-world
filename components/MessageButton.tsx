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
import { doc, getDoc } from "firebase/firestore";

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
   // 1. Fetch metadata
const buyerSnap = await getDoc(doc(db, "users", buyerId));
const buyerName = buyerSnap.data()?.name ?? "";

const storeSnap = await getDoc(doc(db, "stores", sellerId));
const storeName = storeSnap.data()?.storeName ?? "";

// context title
let listingTitle = "";
if (contextType === "listing") {
  const snap = await getDoc(doc(db, "listings", contextId));
  listingTitle = snap.data()?.title ?? "";
}
if (contextType === "auction") {
  const snap = await getDoc(doc(db, "auctions", contextId));
  listingTitle = snap.data()?.title ?? "";
}
if (contextType === "service") {
  const snap = await getDoc(doc(db, "services", contextId));
  listingTitle = snap.data()?.title ?? "";
}
if (contextType === "storefront") {
  listingTitle = storeName;
}

// 2. Create enriched thread
const newThread = await addDoc(collection(db, "threads"), {
  buyerId,
  buyerName,
  sellerId,
  storeName,
  contextType,
  contextId,
  listingTitle,
  lastMessage: "",
  lastMessageAt: serverTimestamp(),
  unreadForBuyer: 0,
  unreadForSeller: 0,
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
