"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import UploadListingImages from "@/components/UploadListingImages";

export default function AddServiceListingPage() {
  const params = useParams();
const category = params?.category as string;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [pricingType, setPricingType] = useState("hourly");
  const [rate, setRate] = useState("");

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    await addDoc(collection(db, "services"), {
      category,
      title,
      description,
      pricingType,
      rate: pricingType === "quote" ? null : Number(rate),
      imageUrls,
      status: "active",
      createdAt: serverTimestamp(),
    });

    router.push(`/services/${category}`);
  };

  const titleFormatted = String(category)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">
        Add {titleFormatted} Service
      </h1>

      <form
        onSubmit={handleCreate}
        className="bg-white p-8 rounded-xl shadow border space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
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

        {/* Pricing Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Pricing Type</label>
          <select
            value={pricingType}
            onChange={(e) => setPricingType(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="hourly">Hourly</option>
            <option value="flat">Flat Rate</option>
            <option value="quote">Quote‑Based</option>
          </select>
        </div>

        {/* Rate (only if hourly or flat) */}
        {pricingType !== "quote" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {pricingType === "hourly" ? "Hourly Rate" : "Flat Rate"}
            </label>
            <input
              type="number"
              required
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="mt-2 w-full px-4 py-2 border rounded-lg"
            />
          </div>
        )}

        {/* Images (optional) */}
        <UploadListingImages images={imageUrls} setImages={setImageUrls} />

        {/* Submit */}
        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          Create Service Listing
        </button>
      </form>
    </div>
  );
}
