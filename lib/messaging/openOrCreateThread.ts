import { db } from "@/lib/firebase/client";
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

export async function openOrCreateThread({
  buyerId,
  buyerName,
  sellerId,
  storeId,
  listingId,
  listingTitle,
  storeName,
  router
}) {
  // 1. Check if a thread already exists
  const q = query(
    collection(db, "threads"),
    where("buyerId", "==", buyerId),
    where("sellerId", "==", sellerId),
    where("storeId", "==", storeId),
    where("listingId", "==", listingId),
    limit(1)
  );

  const snap = await getDocs(q);

  if (!snap.empty) {
    const existingId = snap.docs[0].id;
    router.push(`/messages/${existingId}`);
    return;
  }

  // 2. Create a new thread
  const docRef = await addDoc(collection(db, "threads"), {
    buyerId,
    buyerName,
    sellerId,
    storeId,
    listingId,
    listingTitle,
    storeName,
    lastMessage: "",
    lastMessageAt: serverTimestamp(),
    unreadForBuyer: 0,
    unreadForSeller: 0,
    buyerTyping: false,
    sellerTyping: false
  });

  // 3. Navigate to the new thread
  router.push(`/messages/${docRef.id}`);
}
