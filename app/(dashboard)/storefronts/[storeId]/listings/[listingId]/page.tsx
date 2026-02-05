"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function ListingDetailPage() {
  const params = useParams<{ storeId: string; listingId: string }>();

if (!params) {
  return <p className="p-6 text-gray-600">Loading…</p>;
}

const { storeId, listingId } = params;

const router = useRouter();

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

        if (data.imageUrls && data.imageUrls.length > 0) {
          setActiveImage(data.imageUrls[0]);
        }
      }

      setLoading(false);
    };

    loadListing();
  }, [listingId]);

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this listing?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "listings", listingId as string));
    router.push(`/dashboard/storefronts/${storeId}/listings`);
  };

  if (loading) {
    return <p className="text-gray-600">Loading listing…</p>;
  }

  if (!listing) {
    return <p className="text-gray-600">Listing not found.</p>;
  }

return (
  <div className="space-y-10">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>

      <div className="flex gap-3">
        <button
          onClick={() =>
            router.push(`/dashboard/storefronts/${storeId}/listings`)
          }
          className="px-4 py-2 bg-teal-600 text-white rounded-lg"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>

    {/* Main Image */}
    {activeImage && (
      <img
        src={activeImage}
        className="w-full max-w-xl rounded-xl border object-cover"
      />
    )}

    {/* Thumbnail Strip */}
    {listing.imageUrls && listing.imageUrls.length > 1 && (
      <div className="flex gap-3 mt-4">
        {listing.imageUrls.map((url: string, i: number) => (
          <img
            key={i}
            src={url}
            onClick={() => setActiveImage(url)}
            className={`w-20 h-20 object-cover rounded-lg border cursor-pointer ${
              activeImage === url ? "ring-2 ring-teal-600" : ""
            }`}
          />
        ))}
      </div>
    )}

    {/* Details */}
    <div className="space-y-4">
      <p className="text-lg text-gray-700">{listing.description}</p>

      <p className="text-xl font-semibold text-gray-900">
        ${listing.price}
      </p>

      <p className="text-gray-700">
        <span className="font-medium">Condition:</span> {listing.condition}
      </p>

      <p className="text-gray-700">
        <span className="font-medium">Category:</span> {listing.category}
      </p>

      <p className="text-gray-700">
        <span className="font-medium">Status:</span> {listing.status}
      </p>
</div>
</div>
);
}
