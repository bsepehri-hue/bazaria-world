"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function TimeshareCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const ref = collection(db, "listings");
      const q = query(
        ref,
        where("category", "==", "timeshare"),
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
  }, []);

  if (loading) return <p className="text-gray-600">Loading…</p>;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Timeshares</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.length === 0 ? (
          <p className="text-gray-600 col-span-full text-center">
            No active timeshare listings.
          </p>
        ) : (
          listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white border rounded-xl shadow p-4 space-y-4 cursor-pointer"
              onClick={() => router.push(`/listings/timeshare/${listing.id}`)}
            >
              {listing.images?.length > 0 ? (
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

              <p className="text-gray-800 font-medium">
                ${listing.price?.toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
