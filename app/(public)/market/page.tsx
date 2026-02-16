"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/client";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import Link from "next/link";
import { MARKET_CATEGORIES } from "@/lib/categories";
import CategoryGrid from "@/components/category/CategoryGrid";




export default function MarketPage({ searchParams }) {
  const activeCategory = searchParams?.category || null;

  const [featured, setFeatured] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      const featuredQuery = query(
        collection(db, "listings"),
        orderBy("createdAt", "desc"),
        limit(4)
      );

      const recentQuery = query(
        collection(db, "listings"),
        orderBy("createdAt", "desc"),
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
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* ⭐ Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Where joy becomes treasure.</h1>
        <input
          type="text"
          placeholder="Search listings..."
          className="w-full p-3 border rounded-lg"
        />
      </div>

      {/* ⭐ Categories */}
<section className="mb-12">
  <h2 className="text-xl font-semibold mb-4">Browse Categories</h2>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    {MARKET_CATEGORIES.map((cat) => {
      const isActive = activeCategory === cat.id;

      const Icon = isActive
        ? CategoryIcons[cat.id].active
        : CategoryIcons[cat.id].default;

      return (
        <Link
          key={cat.id}
          href={`/market?category=${cat.id}`}
          className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition
            ${isActive ? "bg-black text-white" : "bg-white text-black"}
            hover:shadow-md hover:scale-[1.03]`}
        >
          <Icon className="w-6 h-6" />
          <span className="text-sm font-medium">{cat.label}</span>
        </Link>
      );
    })}
  </div>
</section>


      {/* ⭐ Featured Listings */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Featured Listings</h2>

        {loading && <div>Loading featured listings...</div>}

        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featured.map((item) => (
              <Link
                key={item.id}
                href={`/${item.category}/${item.id}`}
                className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 block"
              >
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-gray-600">${item.price}</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ⭐ Recently Added */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Recently Added</h2>

        {loading && <div>Loading recent listings...</div>}

        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recent.map((item) => (
              <Link
                key={item.id}
                href={`/${item.category}/${item.id}`}
                className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 block"
              >
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-gray-600">${item.price}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
