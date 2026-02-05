import { db } from "@/lib/firebase/server";
import { doc, getDoc } from "firebase/firestore";

export async function getListingById(id: string) {
  const ref = doc(db, "listings", id);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}
