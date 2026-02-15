"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/client";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function PetsLandingPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      const petsQuery = query(
        collection(db, "listings"),
        where("category", "==", "pets"),
        orderBy("createdAt", "desc"),
        limit(20)
      );

      const snap = await getDocs(petsQuery);
      setListings(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };

    fetchPets();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* ⭐ Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Pets</h1>
        <p className="text-gray-600 mb-4">
          Adopt, buy, or rehome pets — dogs, cats, birds, reptiles, and more.
        </p>

        <Link
          href="/pets/search"
          className="inline-block px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Search Pets
        </Link>
      </div>

      {/* ⭐ Recent Pets Listings */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Listings</h2>

        {loading && <div>Loading pets...</div>}

        {!loading && listings.length === 0 && (
          <p>No pets listed yet. Check back soon.</p>
        )}

        {!loading && listings.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {listings.map((item) => (
              <Link
                key={item.id}
                href={`/pets/${item.id}`}
                className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 block"
              >
                <div className="font-semibold">{item.title}</div>

                {item.price && (
                  <div className="text-sm text-gray-600">
                    ${item.price.toLocaleString()}
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-1 capitalize">
                  {item.type || "Pet"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
