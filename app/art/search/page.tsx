"use client";

import { useSearchParams } from "next/navigation";
import { ArtFilters } from "@/lib/categories/art";
import FiltersBar from "@/components/search/FiltersBar";
import ListingsGrid from "@/components/search/ListingsGrid";
import { useEffect, useState } from "react";

export default function ArtSearchPage() {
  const params = useSearchParams();
  const [listings, setListings] = useState([]);

  // Fetch listings (category = art)
  useEffect(() => {
    async function fetchListings() {
      const query = new URLSearchParams(params.toString());
      query.set("category", "art");

      const res = await fetch(`/api/search?${query.toString()}`);
      const data = await res.json();
      setListings(data);
    }

    fetchListings();
  }, [params]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Art & Collectibles</h1>
        <p className="text-gray-600">
          Explore original works, curated pieces, and timeless creations.
        </p>
      </div>

      {/* Filters */}
      <FiltersBar filters={ArtFilters} />

      {/* Results */}
      <ListingsGrid listings={listings} emptyMessage="No artworks found." />
    </div>
  );
}
