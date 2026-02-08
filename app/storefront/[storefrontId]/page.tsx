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
import { useRouter } from "next/navigation";
import { openOrCreateThread } from "@/lib/messaging/openOrCreateThread";


export default function PublicStorefrontPage() {
  const params = useParams<{ storefrontId: string }>();
  const { storefrontId } = params;

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [branding, setBranding] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const storefrontRef = doc(db, "storefronts", storefrontId);
      const storefrontSnap = await getDoc(storefrontRef);

      if (storefrontSnap.exists()) {
        setBranding(storefrontSnap.data());
      }

      const ref = collection(db, "listings");
      const q = query(
        ref,
        where("storeId", "==", storefrontId),
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
  }, [storefrontId]);

  if (loading) {
    return <p className="text-gray-600">Loading storefront…</p>;
  }
<button
  onClick={async () => {
    await openOrCreateThread({
      buyerId: user.uid,
      buyerName: user.displayName || "Buyer",
      sellerId: store.ownerId,
      storeId: store.id,
      listingId: null,
      listingTitle: null,
      storeName: store.name,
      router
    });
  }}
  className="px-4 py-2 bg-teal-600 text-white rounded-lg"
>
  Message Store
</button>
  return (
    <div className="space-y-10">
      <StorefrontBanner storefrontId={storefrontId} />

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
