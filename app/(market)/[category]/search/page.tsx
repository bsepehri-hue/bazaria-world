"use client";

import GeneralFilters from "@/app/components/GeneralFilters";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";




export default function GeneralSearchPage() {
  const router = useRouter();

  const params = useParams<{ category: string }>();

  if (!params) {
    return <p className="p-6 text-gray-600">Loading…</p>;
  }

  const { category } = params;
  const [loading, setLoading] = useState(true);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    const loadListings = async () => {
      const ref = collection(db, "listings");

      const q = query(
        ref,
        where("category", "==", category),
        where("status", "==", "active"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      const items: any[] = [];

      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });

      setAllListings(items);
      setFiltered(items);
      setLoading(false);
    };

    loadListings();
  }, [category]);

  const applyFilters = (filters: any) => {
    let results = [...allListings];

    // Price
    if (filters.price !== "all") {
      if (filters.price === "500+") {
        results = results.filter((l) => l.price >= 500);
      } else if (filters.price.startsWith("under")) {
        const max = Number(filters.price.replace("under-", ""));
        results = results.filter((l) => l.price <= max);
      } else {
        const [min, max] = filters.price.split("-").map(Number);
        results = results.filter((l) => l.price >= min && l.price <= max);
      }
    }

    // Condition
    if (filters.condition !== "all") {
      results = results.filter((l) => l.condition === filters.condition);
    }

    // Brand
    if (filters.brand.trim() !== "") {
      const b = filters.brand.toLowerCase();
      results = results.filter((l) =>
        (l.brand || "").toLowerCase().includes(b)
      );
    }

    // Keywords
    if (filters.keywords.trim() !== "") {
      const kw = filters.keywords.toLowerCase();
      results = results.filter((l) =>
        `${l.title} ${l.description}`.toLowerCase().includes(kw)
      );
    }

    setFiltered(results);
  };

  if (loading) {
    return <p className="text-gray-600">Loading items…</p>;
  }

  const title = String(category)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Search {title}</h1>

      {/* Filters */}
      <GeneralFilters onChange={applyFilters} />

      {/* Results */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Results</h2>

        {filtered.length === 0 ? (
          <p className="text-gray-600">No items match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((listing) => (
              <div
                key={listing.id}
                className="bg-white border rounded-xl shadow p-4 space-y-4 cursor-pointer"
                onClick={() =>
                  router.push(`/market/${category}/${listing.id}`)
                }
              >
                {/* Thumbnail */}
                {listing.imageUrls?.length > 0 ? (
                  <img
                    src={listing.imageUrls[0]}
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900">
                  {listing.title}
                </h3>

                {/* Price */}
                <p className="text-gray-800 font-medium">${listing.price}</p>

                {/* Condition */}
                <p className="text-gray-600 text-sm capitalize">
                  {listing.condition}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
