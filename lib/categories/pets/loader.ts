import { db } from "@/lib/firebase/server";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export async function loadCategoryListings() {
  const snapshot = await getDocs(collection(db, "listings"));
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((item) => item.category === "pets");
}

export async function loadCategoryDetails(id: string) {
  const ref = doc(db, "listings", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}
