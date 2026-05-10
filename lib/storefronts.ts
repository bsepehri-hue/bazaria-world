import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/server";

export async function getStorefronts(stewardId: string) {
  const q = query(
    collection(db, "storefronts"),
    where("ownerId", "==", stewardId),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

