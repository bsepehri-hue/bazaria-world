"use client";

import ListingCard from "@/components/listings/ListingCard";

export default function ListingGrid({ listings }) {
  if (!listings || listings.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        No listings found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
