"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";

export default function MoreFromSeller({ storeId, currentId }: any) {
  const [items, setItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const ref = collection(db, "listings");
      const q = query(
        ref,
        where("storeId", "==", storeId),
        where("status", "==", "active"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      const results: any[] = [];

      snap.forEach((doc) => {
        if (doc.id !== currentId) {
          results.push({ id: doc.id, ...doc.data() });
        }
      });

      setItems(results.slice(0, 4)); // limit to 4
    };

    load();
  }, [storeId, currentId]);

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {items.map((listing) => (
        <div
          key={listing.id}
          className="bg-white border rounded-xl shadow p-4 space-y-3 cursor-pointer"
          onClick={() => router.push(`/listings/${listing.category}/${listing.id}`)}
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

          <p className="font-semibold text-gray-900">{listing.title}</p>
          <p className="text-gray-800 font-medium">${listing.price}</p>
        </div>
      ))}
    </div>
  );
}
