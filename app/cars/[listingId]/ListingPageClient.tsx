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
    <div className="p-6 space-y-8">

      {/* Title + Created */}
      <div>
        <h1 className="text-3xl font-bold">{listing.title}</h1>

        {listing.createdAt && (
          <p className="text-gray-500 text-sm mt-1">
            Created: {listing.createdAt.toLocaleString()}
          </p>
        )}
      </div>

      {/* Image */}
      {listing.imageUrls?.length > 0 && (
        <img
          src={listing.imageUrls[0]}
          alt={listing.title}
          className="w-full rounded-xl shadow-lg"
        />
      )}

      {/* Specs Grid */}
      <div className="grid grid-cols-2 gap-6 text-lg">
        <div className="space-y-2">
          <p><strong>Make:</strong> {listing.make}</p>
          <p><strong>Model:</strong> {listing.model}</p>
          <p><strong>Year:</strong> {listing.year}</p>
          <p><strong>Odometer:</strong> {listing.odometer}</p>
        </div>

        <div className="space-y-2">
          <p><strong>Price:</strong> ${listing.price}</p>
          <p><strong>Status:</strong> {listing.status}</p>
          <p><strong>Category:</strong> {listing.category}</p>
          <p><strong>VIN:</strong> {listing.vin}</p>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-2xl font-semibold">Description</h2>
        <p className="mt-2 text-gray-700 leading-relaxed">
          {listing.description}
        </p>
      </div>

    </div>
  );
}
