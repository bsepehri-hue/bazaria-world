async function openOrCreateThread({
  buyerId,
  sellerId,
  storeId,
  listingId,
  listingTitle,
  buyerName,
  storeName,
  router
}) {
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
    const existing = snap.docs[0].id;
    router.push(`/messages/${existing}`);
    return;
  }

  const docRef = await addDoc(collection(db, "threads"), {
    buyerId,
    sellerId,
    storeId,
    listingId,
    listingTitle,
    buyerName,
    storeName,
    lastMessage: "",
    lastMessageAt: serverTimestamp(),
    unreadForBuyer: 0,
    unreadForSeller: 0,
    buyerTyping: false,
    sellerTyping: false
  });

  router.push(`/messages/${docRef.id}`);
}
