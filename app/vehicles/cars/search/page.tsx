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
import CarFilters from "@/app/components/CarFilters";

export default function CarSearchPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    const loadListings = async () => {
      const ref = collection(db, "listings");

      const q = query(
        ref,
        where("category", "==", "cars"),
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

    // Make
    if (filters.make !== "all" && filters.make.trim() !== "") {
      results = results.filter((l) =>
        l.make?.toLowerCase().includes(filters.make)
      );
    }

    // Model
    if (filters.model !== "all" && filters.model.trim() !== "") {
      results = results.filter((l) =>
        l.model?.toLowerCase().includes(filters.model)
      );
    }

    // Body Type
    if (filters.body !== "all") {
      results = results.filter((l) => l.body === filters.body);
    }

    // Fuel Type
    if (filters.fuel !== "all") {
      results = results.filter((l) => l.fuel === filters.fuel);
    }

    // Transmission
    if (filters.transmission !== "all") {
      results = results.filter((l) => l.transmission === filters.transmission);
    }

    // Drivetrain
    if (filters.drivetrain !== "all") {
      results = results.filter((l) => l.drivetrain === filters.drivetrain);
    }

    // Year
    if (filters.year !== "all") {
      const minYear = Number(filters.year.replace("+", ""));
      results = results.filter((l) => l.year >= minYear);
    }

    // Mileage
    if (filters.mileage !== "all") {
      if (filters.mileage === "150k+") {
        results = results.filter((l) => l.mileage >= 150000);
      } else if (filters.mileage.startsWith("under")) {
        const max = Number(filters.mileage.replace("under-", "").replace("k", "000"));
        results = results.filter((l) => l.mileage <= max);
      } else {
        const [min, max] = filters.mileage.split("-").map((v: string) =>
  Number(v.replace("k", "000"))
        );
        results = results.filter((l) => l.mileage >= min && l.mileage <= max);
      }
    }

    // Price
    if (filters.price !== "all") {
      if (filters.price === "50000+") {
        results = results.filter((l) => l.price >= 50000);
      } else if (filters.price.startsWith("under")) {
        const max = Number(filters.price.replace("under-", ""));
        results = results.filter((l) => l.price <= max);
      } else {
        const [min, max] = filters.price.split("-").map(Number);
        results = results.filter((l) => l.price >= min && l.price <= max);
      }
    }

    setFiltered(results);
  };

  if (loading) {
    return <p className="text-gray-600">Loading cars…</p>;
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Search Cars</h1>

      {/* Filters */}
      <CarFilters onChange={applyFilters} />

      {/* Results */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Results</h2>

        {filtered.length === 0 ? (
          <p className="text-gray-600">No cars match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((listing) => (
              <div
                key={listing.id}
                className="bg-white border rounded-xl shadow p-4 space-y-4 cursor-pointer"
                onClick={() => router.push(`/vehicles/cars/${listing.id}`)}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
