"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";

export default function PublicListingPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      const ref = doc(db, "listings", id as string);
      const snap = await getDoc(ref);
      
      if (snap.exists()) {
        setListing({ id: snap.id, ...snap.data() });
      }

      setLoading(false);
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading listing...</div>;
  }

  if (!listing) {
    return <div className="p-6">Listing not found.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>

      {/* ⭐ Price */}
      <div className="text-2xl font-semibold text-green-700 mb-6">
        ${listing.price}
      </div>

      {/* ⭐ Image */}
      {listing.imageUrls?.[0] && (
        <img
          src={listing.imageUrls[0]}
          alt={listing.title}
          className="w-full h-80 object-cover rounded-lg mb-6"
        />
      )}

      {/* ⭐ Description */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
      </div>
      
{/* ⭐ Image Gallery */}
{listing.imageUrls?.length > 0 && (
  <div className="mb-6">
    <img
      src={listing.imageUrls[selectedImage]}
      alt={listing.title}
      className="w-full h-80 object-cover rounded-lg mb-4"
    />

    <div className="flex gap-3 overflow-x-auto">
      {listing.imageUrls.map((url: string, index: number) => (
        <img
          key={index}
          src={url}
          onClick={() => setSelectedImage(index)}
          className={`w-20 h-20 object-cover rounded-lg border cursor-pointer ${
            selectedImage === index ? "border-blue-500" : "border-gray-300"
          }`}
        />
      ))}
    </div>
  </div>
)}



      
     {/* ⭐ Details */}
<div className="mb-6">
  <h2 className="text-xl font-semibold mb-2">Details</h2>
  <div className="text-gray-700">
    <div>Category: {listing.category}</div>
    {listing.location && <div>Location: {listing.location}</div>}
    {listing.createdAt && (
      <div>
        Posted:{" "}
        {listing.createdAt.toDate
          ? listing.createdAt.toDate().toLocaleDateString()
          : ""}
      </div>
    )}
  </div>
</div>

{/* ⭐ Seller */}
{listing.storeId && (
  <div className="mt-10 p-4 border rounded-lg bg-gray-50">
    <h2 className="text-xl font-semibold mb-2">Seller</h2>

    <Link
      href={`/storefront/${listing.storeId}`}
      className="text-blue-600 hover:underline"
    >
      Visit Seller Storefront
    </Link>
  </div>
)}

</div>   {/* ← closes the main container div */}

);        {/* ← closes the return(...) */}

}         {/* ← closes the component function */}
