"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

interface CarListingItem {
  id: string;
  title: string;
  price?: number;
  imageUrls?: string[];
  location?: string;
}

export default function CarListing() {
  const [listings, setListings] = useState<CarListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const ref = collection(db, "listings");
        const q = query(
          ref,
          where("category", "==", "cars"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);

        const items: CarListingItem[] = [];
        snap.forEach((doc) => {
          const data = doc.data() as any;
          items.push({
            id: doc.id,
            title: data.title || "Untitled",
            price: data.price,
            imageUrls: data.imageUrls || [],
            location: data.location,
          });
        });

        setListings(items);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading cars…</p>;
  }

  if (!listings.length) {
    return <p className="text-gray-500">No cars listed yet.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Cars</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Link
            key={listing.id}
            href={`/cars/${listing.id}`}
            className="block rounded-xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden"
          >
            {listing.imageUrls?.[0] && (
              <img
                src={listing.imageUrls[0]}
                alt={listing.title}
                className="h-48 w-full object-cover"
              />
            )}

            <div className="p-4 space-y-2">
              <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {listing.title}
              </h2>
              {listing.price !== undefined && (
                <p className="text-indigo-600 font-bold">
                  ${listing.price.toLocaleString()}
                </p>
              )}
              {listing.location && (
                <p className="text-sm text-gray-500">{listing.location}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
