"use client";

import React from "react";
import { useState, cloneElement } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import UploadListingImages from "@/components/UploadListingImages";

interface BaseListingFormProps {
  category: string;
  children: React.ReactNode;
}

export default function BaseListingForm({
  category,
  children,
}: BaseListingFormProps) {
  const params = useParams() as { storeId: string };
const storeId = params.storeId;
  const router = useRouter();

  // Universal fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("new");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Category‑specific fields
  const [extraFields, setExtraFields] = useState({});

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (imageUrls.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    setSaving(true);

    const ref = collection(db, "listings");

    const docRef = await addDoc(ref, {
      title,
      description,
      price: Number(price),
      condition,
      category,
      imageUrls,
      storeId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...extraFields,
    });

    router.push(`/dashboard/storefronts/${storeId}/listings/${docRef.id}`);
  };

  
    let categoryFields = null;

if (children && React.isValidElement(children)) {
  categoryFields = cloneElement(children as React.ReactElement<any>, {
    extraFields,
    setExtraFields,
  });
}

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">
        Create {category.charAt(0).toUpperCase() + category.slice(1)} Listing
      </h1>

      <div className="bg-white p-8 rounded-xl shadow border space-y-6 max-w-2xl">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg h-32 resize-none"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
          <input
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="used">Used</option>
            <option value="for-parts">For Parts</option>
          </select>
        </div>

        {/* Images */}
        <UploadListingImages images={imageUrls} setImages={setImageUrls} />

        {/* Category‑specific fields */}
        {categoryFields}

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
        >
          {saving ? "Saving…" : "Create Listing"}
        </button>
      </div>
    </div>
  );
}
