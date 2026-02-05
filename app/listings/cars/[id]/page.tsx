"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import StorefrontBadges from "@/components/StorefrontBadges";
import MoreFromSeller from "@/components/MoreFromSeller"; // ⭐ Add this



export default function CarDetailPage() {
  const params = useParams()!;
  const id = params.id as string;
  
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [storefront, setStorefront] = useState<any>(null);

  useEffect(() => {
  const load = async () => {
    const ref = doc(db, "listings", id as string);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data: any = { id: snap.id, ...snap.data() };

      setItem(data);

      // Fetch storefront
      if (data.storeId) {
        const storeRef = doc(db, "storefronts", data.storeId);
        const storeSnap = await getDoc(storeRef);

        if (storeSnap.exists()) {
          setStorefront(storeSnap.data());
        }
      }
    }

    setLoading(false);
  };

  load();   // ⭐ THIS is the missing line
}, [id]);

  if (loading) {
    return <p className="text-gray-600">Loading…</p>;
  }

  if (!item) {
    return <p className="text-gray-600">Listing not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Hero Thumbnail */}
      {item.imageUrls?.length > 0 && (
        <img
          src={item.imageUrls[0]}
          className="w-full max-h-[400px] object-cover rounded-xl border mb-6"
        />
      )}

      {/* Gallery Grid */}
      {item.imageUrls?.length > 1 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {item.imageUrls.slice(1).map((url: string, i: number) => (
            <img
              key={i}
              src={url}
              className="w-full h-32 object-cover rounded-lg border"
            />
          ))}
        </div>
      )}

      {/* Title + Price */}
<div>
  <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
  <p className="text-2xl text-teal-700 font-semibold mt-2">
    ${item.price?.toLocaleString()}
  </p>

  {storefront && (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-3">
        {storefront.logoUrl ? (
          <img
            src={storefront.logoUrl}
            alt="Storefront Logo"
            className="w-12 h-12 rounded-full object-cover border"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm border">
            Logo
          </div>
        )}

        <div>
          <p className="font-semibold text-gray-900">{storefront.name}</p>
          <StorefrontBadges storefront={storefront} />
        </div>
      </div>

      {/* View Storefront + Contact Seller */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push(`/storefronts/${item.storeId}`)}
          className="text-teal-700 font-medium hover:underline"
        >
          View Storefront
        </button>

        <button
          onClick={() => router.push(`/messages/new?storeId=${item.storeId}`)}
          className="text-gray-700 font-medium hover:underline"
        >
          Contact Seller
        </button>
      </div>
    </div>
  )}
</div>

      {/* Vehicle Specs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-800">
        <div>
          <p className="font-semibold">Year</p>
          <p>{item.year}</p>
        </div>

        <div>
          <p className="font-semibold">Make</p>
          <p>{item.make}</p>
        </div>

        <div>
          <p className="font-semibold">Model</p>
          <p>{item.model}</p>
        </div>

        <div>
          <p className="font-semibold">VIN</p>
          <p>{item.vin}</p>
        </div>

        <div>
          <p className="font-semibold">Odometer</p>
          <p>{item.odometer?.toLocaleString()} miles</p>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">{item.description}</p>
      </div>

{/* More Listings From This Seller */}
{storefront && (
  <div className="mt-10">
    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
      More listings from {storefront.name}
    </h2>

    <MoreFromSeller storeId={item.storeId} currentId={item.id} />
  </div>
)}

      {/* Metadata */}
      <div className="text-gray-500 text-sm">
        <p>Listing ID: {item.id}</p>
        <p>Storefront: {item.storeId}</p>
        <p>
          Posted:{" "}
          {item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
    </div>
  );
}
