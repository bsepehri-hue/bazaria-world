"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function SellerBlock({ sellerId }: { sellerId: string }) {
  const [seller, setSeller] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (!sellerId) return;

      const ref = doc(db, "storefronts", sellerId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setSeller({ id: snap.id, ...snap.data() });
      }
    };

    load();
  }, [sellerId]);

  if (!seller) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50 text-gray-600">
        Seller information unavailable
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50 space-y-3">

      <div className="flex items-center gap-3">
        <img
          src={seller.logoUrl || "/placeholder-store.png"}
          className="h-12 w-12 rounded-full border object-cover"
        />

        <div>
          <div className="font-semibold">{seller.name}</div>
          <div className="text-sm text-gray-600">Storefront</div>
        </div>
      </div>

      <Link
        href={`/store/${seller.id}`}
        className="inline-block px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-center w-full"
      >
        View Storefront
      </Link>
    </div>
  );
}
