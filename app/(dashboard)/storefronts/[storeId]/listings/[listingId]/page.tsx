"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import UploadListingImages from "@/components/UploadListingImages";

export default function ListingDetailPage({ params }) {
  const { storeId, listingId } = params;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "listings", listingId);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setLoading(false);
        return;
      }

      setListing(snap.data());
      setLoading(false);
    };

    load();
  }, [listingId]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!listing) return <div className="p-6 text-red-600">Listing not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>

        <button
          onClick={() =>
            router.push(
              `/dashboard/storefronts/${storeId}/listings/${listingId}/edit`
            )
          }
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Edit
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Images</h2>
          <UploadListingImages
            images={listing.images || []}
            readOnly={true}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Price</h2>
          <p className="text-gray-700 text-lg font-mono">${listing.price}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
        </div>

        <div className="text-sm text-gray-500 border-t pt-4">
          <p>Listing ID: {listingId}</p>
          {listing.createdAt && (
            <p>
              Created:{" "}
              {new Date(listing.createdAt.seconds * 1000).toLocaleString()}
            </p>
          )}
          {listing.updatedAt && (
            <p>
              Updated:{" "}
              {new Date(listing.updatedAt.seconds * 1000).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
