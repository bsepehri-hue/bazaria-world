"use client";

import { db } from "@/lib/firebase/client";
import { collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";

export default async function PetsListing() {
  const q = query(collection(db, "listings"), where("category", "==", "pets"));
  const snap = await getDocs(q);

  const listings = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Pets</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map(listing => (
          <Link
            key={listing.id}
            href={`/pets/${listing.id}`}
            className="border rounded-xl p-4 shadow"
          >
            <img
              src={listing.imageUrls?.[0]}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="mt-3 font-semibold">{listing.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
