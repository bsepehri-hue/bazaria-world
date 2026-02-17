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
    <div className="p-6 space-y-10">

      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{listing.title}</h1>

        {listing.createdAt && (
          <p className="text-gray-500 text-sm">
            Listed on {listing.createdAt.toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Image */}
      {listing.imageUrls?.length > 0 && (
        <img
          src={listing.imageUrls[0]}
          alt={listing.title}
          className="w-full rounded-xl shadow-md object-cover"
        />
      )}

      {/* Price + Status */}
      <div className="flex items-center justify-between">
        <p className="text-2xl font-semibold text-emerald-600">
          ${listing.price?.toLocaleString()}
        </p>

        <span className="px-3 py-1 text-sm rounded-full bg-emerald-100 text-emerald-700">
          {listing.status}
        </span>
      </div>

      {/* Specs */}
      <div className="grid grid-cols-2 gap-6 text-base">
        <div className="space-y-2">
          {listing.make && <p><strong>Make:</strong> {listing.make}</p>}
          {listing.model && <p><strong>Model:</strong> {listing.model}</p>}
          {listing.year && <p><strong>Year:</strong> {listing.year}</p>}
          {listing.odometer && <p><strong>Odometer:</strong> {listing.odometer}</p>}
        </div>

        <div className="space-y-2">
          {listing.category && <p><strong>Category:</strong> {listing.category}</p>}
          {listing.vin && <p><strong>VIN:</strong> {listing.vin}</p>}
          {listing.color && <p><strong>Color:</strong> {listing.color}</p>}
          {listing.condition && <p><strong>Condition:</strong> {listing.condition}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 leading-relaxed">
          {listing.description}
        </p>
      </div>

      {/* Action */}
      <div>
        <button className="w-full py-3 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition">
          Contact Seller
        </button>
      </div>

    </div>
  );
}
