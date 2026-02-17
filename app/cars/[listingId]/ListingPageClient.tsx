"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export default function ListingPageClient({ listingId }) {
  const [listing, setListing] = useState(null);

  useEffect(() => {
    async function load() {
      const ref = doc(db, "listings", listingId);
      const snap = await getDoc(ref);
      const data = snap.data();

      setListing({
        id: snap.id,
        ...data,
        createdAt: data?.createdAt?.toDate?.() ?? null,
      });
    }

    load();
  }, [listingId]);

  if (!listing) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">{listing.title}</h1>

      {listing.createdAt && (
        <p className="text-gray-600 mt-2">
          Created: {listing.createdAt.toLocaleString()}
        </p>
      )}

      <div className="mt-4 bg-gray-100 p-4 rounded">
        <pre>{JSON.stringify(listing, null, 2)}</pre>
      </div>
    </div>
  );
}
