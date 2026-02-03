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
import { db } from "@/lib/firebase";
import MessageButton from "@/components/MessageButton";

export default function MotorcyclesCategoryPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadListings = async () => {
      const ref = collection(db, "listings");

      const q = query(
        ref,
        where("category", "==", "motorcycles"),
        where("status", "==", "active"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      const items: any[] = [];

      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });

      setListings(items);
      setLoading(false);
    };

    loadListings();
  }, []);

  if (loading) {
    return <p className="text-gray-600">Loading motorcycles…</p>;
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900">Motorcycles & Powersports</h1>
      <p className="text-gray-700">
        Browse motorcycles, dirt bikes, scooters, ATVs, UTVs, and more.
      </p>

      {/* Listings */}
      {listings.length === 0 ? (
        <p className="text-gray-600">No motorcycles available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white border rounded-xl shadow p-4 space-y-4"
            >
              {/* Thumbnail */}
              {listing.imageUrls?.length > 0 ? (
                <img
                  src={listing.imageUrls[0]}
                  className="w-full h-40 object-cover rounded-lg border cursor-pointer"
                  onClick={() => router.push(`/vehicles/motorcycles/${listing.id}`)}
                />
              ) : (
                <div
                  className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 cursor-pointer"
                  onClick={() => router.push(`/vehicles/motorcycles/${listing.id}`)}
                >
                  No Image
                </div>
              )}

              {/* Title */}
              <h3
                className="text-lg font-semibold text-gray-900 cursor-pointer"
                onClick={() => router.push(`/vehicles/motorcycles/${listing.id}`)}
              >
                {listing.title}
              </h3>

              {/* Price */}
              <p className="text-gray-800 font-medium">${listing.price}</p>

              {/* Message Seller */}
              {userId && (
                <MessageButton
                  sellerId={listing.sellerId}
                  buyerId={userId}
                  contextType="listing"
                  contextId={listing.id}
                  label="Message Seller"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
