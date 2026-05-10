"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function StorefrontListingsPage() {
 const params = useParams<{ storeId: string }>();

if (!params) {
  return <p className="p-6 text-gray-600">Loading…</p>;
}

const { storeId } = params;

const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);

  // 🔥 Delete handler (soft delete)
  const handleDelete = async (listingId: string) => {
    const ok = confirm("Are you sure you want to delete this listing?");
    if (!ok) return;

    const ref = doc(db, "listings", listingId);

    await updateDoc(ref, {
      deleted: true,
      deletedAt: Date.now(),
    });

    // Refresh the page
    router.refresh();
  };

  useEffect(() => {
    const loadListings = async () => {
      const ref = collection(db, "listings");
      const q = query(
        ref,
        where("storeId", "==", storeId),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      const items: any[] = [];

      snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));

      // 🔥 Hide deleted listings
      setListings(items.filter((item) => !item.deleted));

      setLoading(false);
    };

    loadListings();
  }, [storeId]);

  if (loading) {
    return <p className="text-gray-600">Loading listings…</p>;
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">All Listings</h1>

        <button
          onClick={() =>
            router.push(`/dashboard/storefronts/${storeId}/listings/new`)
          }
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          Create Listing
        </button>
      </div>

      {listings.length === 0 ? (
        <p className="text-gray-600">No listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white border rounded-xl shadow p-4 space-y-4"
            >
              {listing.imageUrls?.length > 0 ? (
                <img
                  src={listing.imageUrls[0]}
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

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    router.push(
                      `/dashboard/storefronts/${storeId}/listings/${listing.id}`
                    )
                  }
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
                >
                  View
                </button>

                <button
                  onClick={() =>
                    router.push(
                      `/dashboard/storefronts/${storeId}/listings/${listing.id}/edit`
                    )
                  }
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                >
                  Edit
                </button>

                {/* 🔥 Delete Button */}
                <button
                  onClick={() => handleDelete(listing.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
