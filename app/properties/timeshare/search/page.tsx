"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import TimeshareFilters from "@/components/TimeshareFilters";

export default function TimeshareSearchPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    const loadListings = async () => {
      const ref = collection(db, "listings");

      const q = query(
        ref,
        where("category", "==", "timeshare"),
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
  }, []);

  const applyFilters = (filters: any) => {
    let results = [...allListings];

    // Price
    if (filters.price !== "all") {
      if (filters.price === "20k+") {
        results = results.filter((l) => l.price >= 20000);
      } else if (filters.price.startsWith("under")) {
        const max = Number(filters.price.replace("under-", "").replace("k", "000"));
        results = results.filter((l) => l.price <= max);
      } else {
        const [min, max] = filters.price
          .replace(/k/g, "000")
          .split("-")
          .map(Number);
        results = results.filter((l) => l.price >= min && l.price <= max);
      }
    }

    // Interval Type
    if (filters.intervalType !== "all") {
      results = results.filter((l) => l.intervalType === filters.intervalType);
    }

    // Bedrooms
    if (filters.bedrooms !== "all") {
      results = results.filter((l) => l.bedrooms >= Number(filters.bedrooms));
    }

    // Sleeps
    if (filters.sleeps !== "all") {
      results = results.filter((l) => l.sleeps >= Number(filters.sleeps));
    }

    // Season
    if (filters.season !== "all") {
      results = results.filter((l) => l.season === filters.season);
    }

    // Maintenance Fees
    if (filters.fees !== "all") {
      if (filters.fees === "1500+") {
        results = results.filter((l) => l.fees >= 1500);
      } else if (filters.fees.startsWith("under")) {
        const max = Number(filters.fees.replace("under-", ""));
        results = results.filter((l) => l.fees <= max);
      } else {
        const [min, max] = filters.fees.split("-").map(Number);
        results = results.filter((l) => l.fees >= min && l.fees <= max);
      }
    }

    // Resort Rating
    if (filters.rating !== "all") {
      results = results.filter((l) => l.rating >= Number(filters.rating));
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
    return <p className="text-gray-600">Loading timeshares…</p>;
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Search Timeshares</h1>

      {/* Filters */}
      <TimeshareFilters onChange={applyFilters} />

      {/* Results */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Results</h2>

        {filtered.length === 0 ? (
          <p className="text-gray-600">No timeshares match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((listing) => (
              <div
                key={listing.id}
                className="bg-white border rounded-xl shadow p-4 space-y-4 cursor-pointer"
                onClick={() => router.push(`/properties/timeshare/${listing.id}`)}
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

                {/* Interval */}
                <p className="text-gray-600 text-sm capitalize">
                  {listing.intervalType}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
