"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function StorefrontDashboardPage() {
  const params = useParams<{ storeId: string }>();

  if (!params) {
    return <p className="p-6 text-gray-600">Loading…</p>;
  }

  const { storeId } = params;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [branding, setBranding] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const storefrontRef = doc(db, "storefronts", storeId as string);
      const storefrontSnap = await getDoc(storefrontRef);

      if (storefrontSnap.exists()) {
        setBranding(storefrontSnap.data());
      }

      const ref = collection(db, "listings");
      const q = query(
        ref,
        where("storeId", "==", storeId),
        orderBy("createdAt", "desc"),
        limit(6)
      );

      const snap = await getDocs(q);
      const items: any[] = [];

      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });

      setListings(items);
      setLoading(false);
    };

    loadData();
  }, [storeId]);

  if (loading) {
    return <p className="text-gray-600">Loading storefront…</p>;
  }

  const activeCount = listings.filter((l) => l.active === true).length;
  const inactiveCount = listings.filter((l) => l.active !== true).length;

  return (
    <div className="space-y-10">
      {branding?.banner ? (
        <div className="w-full h-48 rounded-xl overflow-hidden border">
          <img
            src={branding.banner}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 border">
          No Banner
        </div>
      )}

      <div className="flex justify-center -mt-16">
        {branding?.logo ? (
          <img
            src={branding.logo}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-white shadow-lg flex items-center justify-center text-gray-600">
            No Logo
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4">
        <h1 className="text-3xl font-bold text-gray-900">Storefront Overview</h1>

        <button
          onClick={() => router.push(`/dashboard/storefronts/${storeId}/branding`)}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
        >
          Edit Branding
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-xl p-6 shadow">
          <p className="text-gray-600 text-sm">Total Listings</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{listings.length}</p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow">
          <p className="text-gray-600 text-sm">Active Listings</p>
          <p className="text-3xl font-bold text-green-700 mt-2">{activeCount}</p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow">
          <p className="text-gray-600 text-sm">Inactive Listings</p>
          <p className="text-3xl font-bold text-gray-700 mt-2">{inactiveCount}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Recent Listings</h2>

        {listings.length === 0 ? (
          <p className="text-gray-600">No listings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/listings/${listing.id}/edit?storeId=${storeId}`)
                    }
                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4">
        <button
          onClick={() => router.push(`/dashboard/storefronts/${storeId}/inventory`)}
          className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
        >
          View All Listings
        </button>
      </div>
    </div>
  );
}
