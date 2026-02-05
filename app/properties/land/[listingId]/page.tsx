"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function PublicLandDetailPage() {
  const params = useParams() as { listingId: string };
const listingId = params.listingId;



  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    const loadListing = async () => {
      const ref = doc(db, "listings", listingId as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setListing(data);

        if (data.imageUrls?.length > 0) {
          setActiveImage(data.imageUrls[0]);
        }
      }

      setLoading(false);
    };

    loadListing();
  }, [listingId]);

  if (loading) {
    return <p className="text-gray-600">Loading land…</p>;
  }

  if (!listing) {
    return <p className="text-gray-600">Land not found.</p>;
  }

  return (
    <div className="space-y-10">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>

      {/* Address */}
      <p className="text-gray-700 text-lg">{listing.address}</p>

      {/* Main Image */}
      {activeImage && (
        <img
          src={activeImage}
          className="w-full max-w-3xl rounded-xl border object-cover"
        />
      )}

      {/* Thumbnail Strip */}
      {listing.imageUrls?.length > 1 && (
        <div className="flex gap-3 mt-4">
          {listing.imageUrls.map((url: string, i: number) => (
            <img
              key={i}
              src={url}
              onClick={() => setActiveImage(url)}
              className={`w-24 h-24 object-cover rounded-lg border cursor-pointer ${
                activeImage === url ? "ring-2 ring-teal-600" : ""
              }`}
            />
          ))}
        </div>
      )}

      {/* Price */}
      <p className="text-3xl font-semibold text-gray-900">
        ${listing.price}
      </p>

      {/* Description */}
      <p className="text-lg text-gray-700 max-w-2xl">{listing.description}</p>

      {/* Specs Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Land Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow border">
          <LandSpec label="Lot Size" value={`${listing.lot} sqft`} />
<LandSpec label="Acreage" value={`${listing.acres} acres`} />
<LandSpec label="Zoning" value={listing.zoning} />
<LandSpec label="Utilities" value={listing.utilities} />
<LandSpec label="Road Access" value={listing.road} />
<LandSpec label="Terrain" value={listing.terrain} />


        </div>
      </div>

      {/* Contact (future) */}
      <div className="pt-6">
        <button
          disabled
          className="px-6 py-3 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
        >
          Contact Seller (coming soon)
        </button>
      </div>
    </div>
  );
}

function LandSpec({ label, value }: { label: string; value: any }) {

  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-lg font-medium text-gray-900">{value}</span>
    </div>
  );
}
