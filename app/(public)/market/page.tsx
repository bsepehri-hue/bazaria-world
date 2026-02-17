"use client";

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import Link from "next/link";
import { MARKET_CATEGORIES, CategoryIcons } from "../../lib/categories";
import CategoryGrid from "@/components/category/CategoryGrid";
import { use, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function MarketPage() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

const [featured, setFeatured] = useState<any[]>([]);
const [recent, setRecent] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchListings = async () => {
    const baseRef = collection(db, "listings");

    const featuredQuery = activeCategory
      ? query(
          baseRef,
          where("category", "==", activeCategory),
          orderBy("createdAt", "desc"),
          limit(4)
        )
      : query(
          baseRef,
          orderBy("createdAt", "desc"),
          limit(4)
        );

    const recentQuery = activeCategory
      ? query(
          baseRef,
          where("category", "==", activeCategory),
          orderBy("createdAt", "desc"),
          limit(8)
        )
      : query(
          baseRef,
          orderBy("createdAt", "desc"),
          limit(8)
        );

    const [featuredSnap, recentSnap] = await Promise.all([
      getDocs(featuredQuery),
      getDocs(recentQuery),
    ]);

    setFeatured(featuredSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setRecent(recentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

    setLoading(false);
  };

  fetchListings();
}, [activeCategory]);
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
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-semibold">Browse Categories</h2>

    {activeCategory && (
      <Link
        href="/market"
        className="text-sm text-teal-600 hover:underline"
      >
        Clear filter
      </Link>
    )}
  </div>

  <div className="space-y-2">
    {MARKET_CATEGORIES.map((cat) => {
      const iconSet = CategoryIcons[cat.id];
      if (!iconSet) return null;

      return (
        <Disclosure key={cat.id}>
          {({ open }) => (
            <div className="border rounded-lg p-3">
              <Disclosure.Button className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <iconSet.default className="w-5 h-5" />
                  {cat.label}
                </span>

                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </Disclosure.Button>

              <Disclosure.Panel className="mt-3 pl-7 space-y-2">
                {cat.subcategories?.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/market?category=${cat.id}&sub=${sub.id}`}
                    className="block text-sm text-gray-700 hover:text-teal-600"
                  >
                    {sub.label}
                  </Link>
                ))}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      );
    })}
  </div>
</section>
      
{/* ⭐ Floating Clear Filter Bar */}
{activeCategory && (
  <div className="sticky top-0 z-20 mb-8 animate-[fadeInUp_0.35s_ease-out]">
    <div className="bg-white border rounded-lg shadow-sm p-3 flex items-center justify-between">
      
      {/* Left side: Icon + label */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          {/* Soft teal glow */}
          <div className="absolute w-7 h-7 rounded-full bg-teal-400 opacity-20 blur-md"></div>

          {/* Active category icon */}
          {(() => {
            const Icon = CategoryIcons[activeCategory]?.active;
            return Icon ? <Icon className="w-5 h-5 text-black relative" /> : null;
          })()}
        </div>

        <span className="text-sm text-gray-700">
          Showing results for <strong>{activeCategory}</strong>
        </span>
      </div>

      {/* Right side: Clear filter */}
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
      No featured listings found in this category.
    </div>
  )}

  {!loading && featured.length > 0 && (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {featured.map((item) => {
        const Icon =
          activeCategory === item.category
            ? CategoryIcons[item.category]?.active
            : CategoryIcons[item.category]?.default;

        return (
          <Link
            key={item.id}
            href={`/listing/${item.id}`}
            className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 block"
          >
            <div className="flex items-center gap-2 mb-1">
              {Icon && <Icon className="w-4 h-4 text-gray-500" />}
              <div className="font-semibold">{item.title}</div>
            </div>

            <div className="text-sm text-gray-600">${item.price}</div>
          </Link>
        );
      })}
    </div>
  )}
</section>

  {/* ⭐ Recently Added */}
<section className="mb-12">
  <h2 className="text-xl font-semibold mb-4">Recently Added</h2>

  {loading && <div>Loading recent listings...</div>}

  {!loading && recent.length === 0 && (
    <div className="text-gray-500 text-sm p-4 border rounded-lg bg-gray-50">
      No recent listings found in this category.
    </div>
  )}

  {!loading && recent.length > 0 && (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {recent.map((item) => {
        const Icon =
          activeCategory === item.category
            ? CategoryIcons[item.category]?.active
            : CategoryIcons[item.category]?.default;

        return (
          <Link
            key={item.id}
            href={`/${item.category}/${item.id}`}
            className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 block"
          >
            <div className="flex items-center gap-2 mb-1">
              {Icon && <Icon className="w-4 h-4 text-gray-500" />}
              <div className="font-semibold">{item.title}</div>
            </div>

            <div className="text-sm text-gray-600">${item.price}</div>
          </Link>
        );
      })}
    </div>
  )}
</section>
    </div>
  );
}
