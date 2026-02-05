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
import RoomFilters from "@/components/RoomFilters";

export default function RoomSearchPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    const loadListings = async () => {
      const ref = collection(db, "listings");

      const q = query(
        ref,
        where("category", "==", "rooms"),
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
      if (filters.price === "1800+") {
        results = results.filter((l) => l.price >= 1800);
      } else if (filters.price.startsWith("under")) {
        const max = Number(filters.price.replace("under-", ""));
        results = results.filter((l) => l.price <= max);
      } else {
        const [min, max] = filters.price.split("-").map(Number);
        results = results.filter((l) => l.price >= min && l.price <= max);
      }
    }

    // Room Type
    if (filters.roomType !== "all") {
      results = results.filter((l) => l.roomType === filters.roomType);
    }

    // Bathroom Type
    if (filters.bathType !== "all") {
      results = results.filter((l) => l.bathType === filters.bathType);
    }

    // Sqft
    if (filters.sqft !== "all") {
      if (filters.sqft === "400+") {
        results = results.filter((l) => l.sqft >= 400);
      } else if (filters.sqft.startsWith("under")) {
        const max = Number(filters.sqft.replace("under-", ""));
        results = results.filter((l) => l.sqft <= max);
      } else {
        const [min, max] = filters.sqft.split("-").map(Number);
        results = results.filter((l) => l.sqft >= min && l.sqft <= max);
      }
    }

    // Lease Length
    if (filters.lease !== "all") {
      results = results.filter((l) => l.lease === filters.lease);
    }

    // Pet Policy
    if (filters.pets !== "all") {
      results = results.filter((l) => l.pets === filters.pets);
    }

    // Parking
    if (filters.parking !== "all") {
      results = results.filter((l) => l.parking === filters.parking);
    }

    // Utilities Included
    if (filters.utilities !== "all") {
      results = results.filter((l) => l.utilities === filters.utilities);
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
    return <p className="text-gray-600">Loading rooms…</p>;
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Search Rooms</h1>

      {/* Filters */}
      <RoomFilters onChange={applyFilters} />

      {/* Results */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Results</h2>

        {filtered.length === 0 ? (
          <p className="text-gray-600">No rooms match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((listing) => (
              <div
                key={listing.id}
                className="bg-white border rounded-xl shadow p-4 space-y-4 cursor-pointer"
                onClick={() => router.push(`/properties/rooms/${listing.id}`)}
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
                <p className="text-gray-800 font-medium">
                  ${listing.price} / month
                </p>

                {/* Room Type */}
                <p className="text-gray-600 text-sm capitalize">
                  {listing.roomType}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
