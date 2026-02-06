"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import UploadListingImages from "@/components/UploadListingImages";

export default function EditListingPage({ params }) {
  const { storeId, listingId } = params;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    images: [],
  });

  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "listings", listingId);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setLoading(false);
        return;
      }

      const data = snap.data();
      setListing(data);

      setForm({
        title: data.title || "",
        description: data.description || "",
        price: data.price || "",
        images: data.images || [],
      });

      setLoading(false);
    };

    load();
  }, [listingId]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ref = doc(db, "listings", listingId);

    await updateDoc(ref, {
      title: form.title,
      description: form.description,
      price: form.price,
      images: form.images,
      updatedAt: new Date(),
    });

    await logActivity(
      listing.userId,
      "listing_updated",
      `Updated listing: ${form.title}`,
      `/listings/${listingId}`
    );

    router.push(`/dashboard/storefronts/${storeId}/listings/${listingId}`);
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (!listing) return <div className="p-6 text-red-600">Listing not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
