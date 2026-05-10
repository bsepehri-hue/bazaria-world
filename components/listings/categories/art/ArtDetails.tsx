"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getArtDetails } from "@/lib/categories/art/loader";

export default function ArtDetails({ listingId }) {
  const [listing, setListing] = useState(null);

  useEffect(() => {
    getArtDetails(listingId).then(setListing);
  }, [listingId]);

  if (!listing) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      {/* Title + Artist */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
        {listing.artist && (
          <p className="text-lg text-gray-700">By {listing.artist}</p>
        )}
      </div>

      {/* Image Gallery */}
      {listing.imageUrls?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {listing.imageUrls.map((url, index) => (
            <div
              key={index}
              className="relative w-full h-64 rounded-lg overflow-hidden shadow-sm"
            >
              <Image
                src={url}
                alt={`${listing.title} image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Price */}
      {listing.price && (
        <p className="text-2xl font-semibold text-teal-700">
          ${listing.price.toLocaleString()}
        </p>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 border rounded-lg bg-gray-50">
        {listing.medium && (
          <Detail label="Medium" value={listing.medium} />
        )}
        {listing.dimensions && (
          <Detail label="Dimensions" value={listing.dimensions} />
        )}
        {listing.yearCreated && (
          <Detail label="Year Created" value={listing.yearCreated} />
        )}
        {listing.condition && (
          <Detail label="Condition" value={listing.condition} />
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Description</h2>
        <p className="text-gray-700 leading-relaxed">
          {listing.description}
        </p>
      </div>

      {/* Location */}
      {listing.location && (
        <div>
          <h2 className="text-xl font-semibold mb-1">Location</h2>
          <p className="text-gray-700">{listing.location}</p>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
