"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { StorefrontBanner } from "@/components/storefront/StorefrontBanner/StorefrontBanner";

export default function PublicStorefrontPage() {
  const params = useParams<{ storeId: string }>();
  const { storeId } = params;

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [branding, setBranding] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const storefrontRef = doc(db, "storefronts", storeId);
      const storefrontSnap = await getDoc(storefrontRef);

      if (storefrontSnap.exists()) {
        setBranding(storefrontSnap.data());
      }

      const ref = collection(db, "listings");
      const q = query(
        ref,
        where("storeId", "==", storeId),
        where("active", "==", true),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      const items: any[] = [];

      snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));

      setListings(items);
      setLoading(false);
    };

    load();
  }, [storeId]);

  if (loading) {
    return <p className="text-gray-600">Loading storefront…</p>;
  }

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

      <h1 className="text-3xl font-bold text-gray-900 text-center">
        {branding?.name || "Storefront"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
        {listings.length === 0 ? (
          <p className="text-gray-600 col-span-full text-center">
            No active listings.
          </p>
        ) : (
          listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white border rounded-xl shadow p-4 space-y-4 cursor-pointer"
              onClick={() => router.push(`/listing/${listing.id}`)}
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
