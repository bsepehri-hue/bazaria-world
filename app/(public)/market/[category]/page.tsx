"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase/client";
import { collection, query, where, getDocs } from "firebase/firestore";
import { MARKET_CATEGORIES } from "@/lib/categories";

export default function CategoryPage() {
  const { category } = useParams();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryInfo = MARKET_CATEGORIES.find((c) => c.id === category);

  useEffect(() => {
    const fetchListings = async () => {
      const q = query(
        collection(db, "listings"),
        where("category", "==", categoryInfo.label)
      );

      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setListings(items);
      setLoading(false);
    };

    fetchListings();
  }, [category]);

  if (!categoryInfo) {
    return <div className="p-6">Invalid category.</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{categoryInfo.label}</h1>

      {loading && <div>Loading listings...</div>}

      {!loading && listings.length === 0 && (
        <div>No listings found in this category.</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {listings.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            <div className="font-semibold">{item.title}</div>
            <div className="text-sm text-gray-600">${item.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
