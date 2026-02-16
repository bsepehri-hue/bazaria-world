"use client";

import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import { petsDetails } from "@/lib/details/petsDetails";
import { petsSpecs } from "@/lib/specs/petsSpecs";

export default async function PetsListingPage({
  params,
}: {
  params: { storeId: string; listingId: string };
}) {
  const { listingId } = params;

  const ref = doc(db, "listings", listingId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return notFound();
  }

  const listing = snap.data();

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listing.imageUrls?.map((url: string, i: number) => (
          <img
            key={i}
            src={url}
            alt={listing.title}
            className="rounded-xl border object-cover w-full h-80"
          />
        ))}
      </div>

      {/* Details */}
      <div className="bg-white p-8 rounded-xl shadow border space-y-8">
        {petsDetails.layout.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {section.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field) => {
                const spec = petsSpecs[field];
                const value = listing[field];

                if (!spec) return null;

                return (
                  <div key={field}>
                    <p className="text-sm font-medium text-gray-600">
                      {spec.label}
                    </p>
                    <p className="mt-1 text-gray-900">
                      {value || "—"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
