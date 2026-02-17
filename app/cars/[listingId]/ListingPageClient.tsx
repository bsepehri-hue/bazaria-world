"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ListingPageClient({ listingId }) {
  const [listing, setListing] = useState(null);

  useEffect(() => {
    async function load() {
      const ref = doc(db, "listings", listingId);
      const snap = await getDoc(ref);
      setListing({ id: snap.id, ...snap.data() });
    }
    load();
  }, [listingId]);

  if (!listing) return <div>Loading...</div>;

  return (
    <div>
      <h1>{listing.title}</h1>
      <pre>{JSON.stringify(listing, null, 2)}</pre>
    </div>
  );
}
