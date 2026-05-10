"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function InventoryPage() {
  const params = useParams<{ storeId: string }>();
  const { storeId } = params;

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const ref = collection(db, "listings");
      const q = query(
        ref,
        where("storeId", "==", storeId),
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

    load();
  }, [storeId]);

  if (loading) {
    return <p className="text-gray-600">Loading inventory…</p>;
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>

        <button
          onClick={() =>
            router.push(`/dashboard/storefronts/${storeId}/listings/new`)
          }
          className="px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          Add Listing
        </button>
      </div>

      {listings.length === 0 ? (
        <p className="text-gray-600">No listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white border rounded-xl shadow p-4 space-y-4"
            >
              {listing.images && listing.images.length > 0 ? (
                <img
                  src={listing.images[0]}
                  className="w-full h-40 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <h3 className="text-lg font-semibold text-gray-900">
                {listing.title}
              </h3>

              <p className="text-gray-800 font-medium">${listing.price}</p>

              <p
                className={`text-sm font-medium ${
                  listing.active ? "text-green-600" : "text-gray-500"
                }`}
              >
                {listing.active ? "Active" : "Inactive"}
              </p>

              <button
                onClick={() =>
                  router.push(
                    `/dashboard/listings/${listing.id}/edit?storeId=${storeId}`
                  )
                }
                className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
