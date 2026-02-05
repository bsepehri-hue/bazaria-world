"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import MessageButton from "@/components/MessageButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

export default function CarsCategoryPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [user] = useAuthState(auth);
  const userId = user?.uid || null;

  useEffect(() => {
    const loadListings = async () => {
      const ref = collection(db, "listings");

      const q = query(
        ref,
        where("category", "==", "cars"),
        where("status", "==", "active"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      const items: any[] = [];

      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });

      setListings(items);
      setLoading(false);
    };

    loadListings();
  }, []);

  if (loading) {
    return <p className="text-gray-600">Loading cars…</p>;
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900">Cars</h1>
      <p className="text-gray-700">
        Browse sedans, SUVs, coupes, hatchbacks, and more.
      </p>

      {/* Listings */}
    {listings.length === 0 ? (
  <p className="text-gray-600">No cars available.</p>
) : (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {listings.map((listing) => (
      <div
        key={listing.id}
        className="bg-white border rounded-xl shadow p-4 space-y-4 cursor-pointer"
        onClick={() => router.push(`/vehicles/cars/${listing.id}`)}
      >
        {/* Thumbnail */}
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

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900">
          {listing.title}
        </h3>

        {/* Price */}
        <p className="text-gray-800 font-medium">${listing.price}</p>

  {userId && (
  <MessageButton
    sellerId={listing.sellerId}
    buyerId={userId}
    contextType="listing"
    contextId={listing.id}
    label="Message Seller"
  />
)}

      </div>
    ))}
  </div>
)}
</div>
);
}
