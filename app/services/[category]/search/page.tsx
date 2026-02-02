"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ServicesSearchPage() {
  const router = useRouter();
  const params = useParams();
const category = params?.category as string;

  const [loading, setLoading] = useState(true);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    const loadListings = async () => {
      const ref = collection(db, "services");

      const q = query(
        ref,
        where("category", "==", category),
        where("status", "==", "active"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      const items: any[] = [];

      snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));

      setAllListings(items);
      setFiltered(items);
      setLoading(false);
    };

    loadListings();
  }, [category]);

  const applyFilters = (filters: any) => {
    let results = [...allListings];

    // Pricing Type
    if (filters.pricingType !== "all") {
      results = results.filter((s) => s.pricingType === filters.pricingType);
    }

    // Rate Range
    if (filters.rate !== "all") {
      if (filters.rate === "200+") {
        results = results.filter((s) => s.rate >= 200);
      } else if (filters.rate.startsWith("under")) {
        const max = Number(filters.rate.replace("under-", ""));
        results = results.filter((s) => s.rate <= max);
      } else {
        const [min, max] = filters.rate.split("-").map(Number);
        results = results.filter((s) => s.rate >= min && s.rate <= max);
      }
    }

    // Keywords
    if (filters.keywords.trim() !== "") {
      const kw = filters.keywords.toLowerCase();
      results = results.filter((s) =>
        `${s.title} ${s.description}`.toLowerCase().includes(kw)
      );
    }

    setFiltered(results);
  };

  if (loading) return <p className="text-gray-600">Loading services…</p>;

  const title = String(category)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Search {title}</h1>

      {/* Filters */}
      <ServiceFilters onChange={applyFilters} />

      {/* Results */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Results</h2>

        {filtered.length === 0 ? (
          <p className="text-gray-600">No services match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((service) => (
              <div
                key={service.id}
                className="bg-white border rounded-xl shadow p-4 space-y-4 cursor-pointer"
                onClick={() =>
                  router.push(`/services/${category}/${service.id}`)
                }
              >
                {/* Thumbnail */}
                {service.imageUrls?.length > 0 ? (
                  <img
                    src={service.imageUrls[0]}
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900">
                  {service.title}
                </h3>

                {/* Pricing */}
                <p className="text-gray-800 font-medium capitalize">
                  {service.pricingType === "hourly"
                    ? `$${service.rate}/hr`
                    : service.pricingType === "flat"
                    ? `$${service.rate} flat`
                    : "Contact for quote"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
