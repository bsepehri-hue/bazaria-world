import { db } from "@/app/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export async function getMarketplaceItems() {
  const listingsRef = collection(db, "listings");
  const auctionsRef = collection(db, "auctions");
  const storefrontsRef = collection(db, "storefronts");

  const [listingsSnap, auctionsSnap, storefrontsSnap] = await Promise.all([
    getDocs(query(listingsRef, orderBy("createdAt", "desc"), limit(20))),
    getDocs(query(auctionsRef, orderBy("createdAt", "desc"), limit(20))),
    getDocs(query(storefrontsRef, orderBy("createdAt", "desc"), limit(20))),
  ]);

  const listings = listingsSnap.docs.map((d) => ({
    id: d.id,
    type: "listing",
    ...d.data(),
  }));

  const auctions = auctionsSnap.docs.map((d) => ({
    id: d.id,
    type: "auction",
    ...d.data(),
  }));

  const storefronts = storefrontsSnap.docs.map((d) => ({
    id: d.id,
    type: "storefront",
    ...d.data(),
  }));

  return [...listings, ...auctions, ...storefronts].sort(
    (a, b) => b.createdAt - a.createdAt
  );
}
