"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

interface CarDetailsProps {
  listingId: string;
}

interface CarListing {
  title: string;
  price?: number;
  description?: string;
  imageUrls?: string[];
  location?: string;
  year?: number;
  make?: string;
  model?: string;
  mileage?: number;
  transmission?: string;
  fuelType?: string;
  bodyStyle?: string;
  color?: string;
  [key: string]: any;
}

export default function CarDetails({ listingId }: CarDetailsProps) {
  const [listing, setListing] = useState<CarListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const ref = doc(db, "listings", listingId);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setListing(null);
          return;
        }
        setListing(snap.data() as CarListing);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [listingId]);

  if (loading) {
    return <p className="text-gray-500">Loading car details…</p>;
  }

  if (!listing) {
    return <p className="text-gray-500">Car not found.</p>;
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>

      {/* Images */}
      {listing.imageUrls && listing.imageUrls.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listing.imageUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={listing.title}
              className="rounded-xl border object-cover w-full h-80"
            />
          ))}
        </div>
      )}

      {/* Primary info */}
      <div className="bg-white p-8 rounded-xl shadow border space-y-6">
        {listing.price !== undefined && (
          <p className="text-2xl font-bold text-indigo-600">
            ${listing.price.toLocaleString()}
          </p>
        )}

        {listing.location && (
          <p className="text-gray-600">
            <span className="font-medium">Location:</span> {listing.location}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listing.year && (
            <DetailField label="Year" value={listing.year.toString()} />
          )}
          {listing.make && <DetailField label="Make" value={listing.make} />}
          {listing.model && <DetailField label="Model" value={listing.model} />}
          {listing.mileage !== undefined && (
            <DetailField
              label="Mileage"
              value={`${listing.mileage.toLocaleString()} km`}
            />
          )}
          {listing.transmission && (
            <DetailField label="Transmission" value={listing.transmission} />
          )}
          {listing.fuelType && (
            <DetailField label="Fuel Type" value={listing.fuelType} />
          )}
          {listing.bodyStyle && (
            <DetailField label="Body Style" value={listing.bodyStyle} />
          )}
          {listing.color && <DetailField label="Color" value={listing.color} />}
        </div>

        {listing.description && (
          <div className="pt-4 border-t">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Description
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {listing.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="mt-1 text-gray-900">{value}</p>
    </div>
  );
}
