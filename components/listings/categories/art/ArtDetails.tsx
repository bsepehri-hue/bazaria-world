"use client";

import { useEffect, useState } from "react";
import { getArtDetails } from "@/lib/categories/art/loader";

export default function ArtDetails({ listingId }) {
  const [listing, setListing] = useState(null);

  useEffect(() => {
    getArtDetails(listingId).then(setListing);
  }, [listingId]);

  if (!listing) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">{listing.title}</h1>

      {listing.imageUrls?.[0] && (
        <img
          src={listing.imageUrls[0]}
          alt={listing.title}
          className="mt-4 rounded"
        />
      )}

      <pre className="mt-4 bg-gray-100 p-4 rounded">
        {JSON.stringify(listing, null, 2)}
      </pre>
    </div>
  );
}
