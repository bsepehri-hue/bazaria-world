import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getListing(listingId: string) {
  const ref = doc(db, "listings", listingId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
  };
}
