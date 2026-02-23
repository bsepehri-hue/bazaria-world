"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { db } from "@/lib/firebase/client";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

import CategoryMenu from "./CategoryMenu";
import ListingCard from "@/components/listings/ListingCard";

export default function MarketPage() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const [featured, setFeatured] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      const baseRef = collection(db, "listings");

      let constraints: any[] = [];

      // Category filter
      if (activeCategory) {
        constraints.push(where("category", "==", activeCategory));
      }

      // Search filter (prefix search)
      if (searchTerm.trim() !== "") {
        constraints.push(where("title", ">=", searchTerm));
        constraints.push(where("title", "<=", searchTerm + "\uf8ff"));
      }

      // Featured (4 items)
      const featuredQuery = query(
        baseRef,
        ...constraints,
        orderBy("title"),
        limit(4)
      );

      // Recently Added (8 items)
      const recentQuery = query(
        baseRef,
        ...constraints,
        orderBy("title"),
        limit(8)
      );

      const [featuredSnap, recentSnap] = await Promise.all([
        getDocs(featuredQuery),
        getDocs(recentQuery),
      ]);

      setFeatured(
        featuredSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setRecent(
        recentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      setLoading(false);
    };

    fetchListings();
  }, [activeCategory, searchTerm]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* ⭐ Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Where joy becomes treasure.</h1>

        <input
          type="text"
          placeholder="Search listings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <CategoryMenu activeCategory={activeCategory} />

      {/* ⭐ Floating Clear Filter Bar */}
      {activeCategory && (
        <div className="sticky top-0 z-20 mb-8 animate-[fadeInUp_0.35s_ease-out]">
          <div className="bg-white border rounded-lg shadow-sm p-3 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing results for <strong>{activeCategory}</strong>
            </div>

            <Link
              href="/market"
              className="text-sm text-teal-600 font-medium hover:underline"
            >
              Clear filter
            </Link>
          </div>
        </div>
      )}

      {/* ⭐ Featured Listings */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Featured Listings</h2>

        {loading && <div>Loading featured listings...</div>}

        {!loading && featured.length === 0 && (
          <div className="text-gray-500 text-sm p-4 border rounded-lg bg-gray-50">
            No featured listings found.
          </div>
        )}

        {!loading && featured.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((item) => (
              <ListingCard
                key={item.id}
                id={item.id}
                category={item.category}
                title={item.title}
                price={item.price}
                location={item.location}
                images={item.imageUrls || item.images}
                year={item.year}
                make={item.make}
                model={item.model}
                mileage={item.mileage}
                description={item.description}
                createdAt={item.createdAt}
              />
            ))}
          </div>
        )}
      </section>

      {/* ⭐ Recently Added */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Recently Added</h2>

        {loading && <div>Loading recent listings...</div>}

        {!loading && recent.length === 0 && (
          <div className="text-gray-500 text-sm p-4 border rounded-lg bg-gray-50">
            No recent listings found.
          </div>
        )}

        {!loading && recent.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recent.map((item) => (
              <ListingCard
                key={item.id}
                id={item.id}
                category={item.category}
                title={item.title}
                price={item.price}
                location={item.location}
                images={item.imageUrls || item.images}
                year={item.year}
                make={item.make}
                model={item.model}
                mileage={item.mileage}
                description={item.description}
                createdAt={item.createdAt}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
