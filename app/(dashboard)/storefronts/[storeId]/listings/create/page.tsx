"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/client";
import { collection, addDoc } from "firebase/firestore";
import { generalItemCategories } from "@/lib/schemas/generalItems";
import CategoryFields from "@/components/CategoryFields";
import UploadListingImages from "@/components/UploadListingImages";
import { logActivity } from "@/lib/activity/logActivity";

export default function CreateListingPage({ params }) {
  const { storeId } = params;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState<keyof typeof generalItemCategories | "">("");
  const [attributes, setAttributes] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title || !price || !category) return;
    setSaving(true);

    const ref = collection(db, "listings");

    const docRef = await addDoc(ref, {
      storeId,
      title,
      price: Number(price),
      description,
      images,
      category,
      attributes,
      createdAt: new Date(),
      deleted: false,
    });

    await logActivity(
      storeId,
      "listing_created",
      `Created listing: ${title}`
    );

    router.push(`/dashboard/storefronts/${storeId}/listings/${docRef.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Create Listing</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            className="mt-1 w-full border rounded px-3 py-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            className="mt-1 w-full border rounded px-3 py-2"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as keyof typeof generalItemCategories)
            }
          >
            <option value="">Select…</option>
            {Object.entries(generalItemCategories).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>

        {category && (
          <CategoryFields
            category={category}
            values={attributes}
            onChange={(key, value) =>
              setAttributes((prev) => ({ ...prev, [key]: value }))
            }
          />
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            className="mt-1 w-full border rounded px-3 py-2"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Images</h2>
          <UploadListingImages images={images} onChange={setImages} />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || !title || !price || !category}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Create Listing"}
          </button>
        </div>
      </div>
    </div>
  );
}
