import { db } from "@/lib/firebase/server";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

export async function getStorefrontData(storefrontId: string) {
  // Fetch storefront document
  const ref = doc(db, "storefronts", storefrontId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const storefront = { id: storefrontId, ...snap.data() };

  // Fetch listings for this storefront
  const listingsRef = collection(db, "listings");
  const q = query(listingsRef, where("storefrontId", "==", storefrontId));
  const listingSnap = await getDocs(q);

  const listings: any[] = [];
  listingSnap.forEach((doc) => listings.push({ id: doc.id, ...doc.data() }));

  return { storefront, listings };
}
