"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { generalItemCategories } from "@/lib/schemas/generalItems";
import Image from "next/image";

export default function ListingDetailPage({ params }) {
  const { storeId, listingId } = params;

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "listings", listingId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setListing(snap.data());
      }

      setLoading(false);
    };

    load();
  }, [listingId]);

  if (loading) {
    return (
      <div className="p-6 text-gray-600">
        Loading…
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="p-6 text-gray-600">
        Listing not found.
      </div>
    );
  }

  const schema = generalItemCategories[listing.category];
  const fields = schema?.fields || [];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {listing.images?.map((src: string, i: number) => (
            <div key={i} className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image src={src} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <p className="text-2xl font-semibold text-gray-900">
            ${listing.price}
          </p>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Details</h2>

            {fields.map((field) => {
              const value = listing.attributes?.[field.key];

              return (
                <div key={field.key}>
                  <p className="text-sm font-medium text-gray-700">
                    {field.label}
                  </p>

                  <p className="text-gray-900 whitespace-pre-wrap">
                    {field.type === "kv"
                      ? JSON.stringify(value || {}, null, 2)
                      : value || "—"}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Description</h2>
            <p className="text-gray-900 whitespace-pre-wrap">
              {listing.description || "No description provided."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
