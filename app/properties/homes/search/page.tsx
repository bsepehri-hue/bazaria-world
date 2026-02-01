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
import { db } from "@/lib/firebase";
import HomeFilters from "@/components/HomeFilters";





export default function HomeSearchPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    const loadListings = async () => {
      const ref = collection(db, "listings");

      const q = query(
        ref,
        where("category", "==", "homes"),
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
      if (filters.price === "1m+") {
        results = results.filter((l) => l.price >= 1000000);
      } else if (filters.price.startsWith("under")) {
        const max = Number(filters.price.replace("under-", "").replace("k", "000"));
        results = results.filter((l) => l.price <= max);
      } else {
        const [min, max] = filters.price
          .replace("k", "000")
          .replace("m", "000000")
          .split("-")
          .map(Number);
        results = results.filter((l) => l.price >= min && l.price <= max);
      }
    }

    // Beds
    if (filters.beds !== "all") {
      results = results.filter((l) => l.beds >= Number(filters.beds));
    }

    // Baths
    if (filters.baths !== "all") {
      results = results.filter((l) => l.baths >= Number(filters.baths));
    }

    // Sqft
    if (filters.sqft !== "all") {
      if (filters.sqft === "3000+") {
        results = results.filter((l) => l.sqft >= 3000);
      } else if (filters.sqft.startsWith("under")) {
        const max = Number(filters.sqft.replace("under-", ""));
        results = results.filter((l) => l.sqft <= max);
      } else {
        const [min, max] = filters.sqft.split("-").map(Number);
        results = results.filter((l) => l.sqft >= min && l.sqft <= max);
      }
    }

    // Lot Size
    if (filters.lot !== "all") {
      if (filters.lot === "20000+") {
        results = results.filter((l) => l.lot >= 20000);
      } else if (filters.lot.startsWith("under")) {
        const max = Number(filters.lot.replace("under-", ""));
        results = results.filter((l) => l.lot <= max);
      } else {
        const [min, max] = filters.lot.split("-").map(Number);
        results = results.filter((l) => l.lot >= min && l.lot <= max);
      }
    }

    // Home Type
    if (filters.type !== "all") {
      results = results.filter((l) => l.type === filters.type);
    }

    // Year Built
    if (filters.year !== "all") {
      const minYear = Number(filters.year.replace("+", ""));
      results = results.filter((l) => l.yearBuilt >= minYear);
    }

    // Parking
    if (filters.parking !== "all") {
      results = results.filter((l) => l.parking === filters.parking);
    }

    // HOA
    if (filters.hoa !== "all") {
      if (filters.hoa === "none") {
        results = results.filter((l) => !l.hoa || l.hoa === 0);
      } else if (filters.hoa === "400+") {
        results = results.filter((l) => l.hoa >= 400);
      } else {
        const [min, max] = filters.hoa
          .replace("under-", "0-")
          .replace("+", "")
          .split("-")
          .map(Number);
        results = results.filter((l) => l.hoa >= min && l.hoa <= max);
      }
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
    return <p className="text-gray-600">Loading homes…</p>;
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Search Homes</h1>

      {/* Filters */}
      <HomeFilters onChange={applyFilters} />

      {/* Results */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Results</h2>

        {filtered.length === 0 ? (
          <p className="text-gray-600">No homes match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((listing) => (
              <div
                key={listing.id}
                className="bg-white border rounded-xl shadow p-4 space-y-4 cursor-pointer"
                onClick={() => router.push(`/properties/homes/${listing.id}`)}
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

                {/* Beds/Baths/Sqft */}
                <p className="text-gray-600 text-sm">
                  {listing.beds} bd • {listing.baths} ba • {listing.sqft} sqft
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
