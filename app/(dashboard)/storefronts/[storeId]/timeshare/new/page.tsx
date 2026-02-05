"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

import UploadListingImages from "@/components/UploadListingImages";

export default function AddTimeshareListingPage() {
 const params = useParams<{ storeId: string }>();

if (!params) {
  return <p className="p-6 text-gray-600">Loading…</p>;
}

const { storeId } = params;

const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // Timeshare-specific fields
  const [intervalType, setIntervalType] = useState("weekly");
  const [bedrooms, setBedrooms] = useState("1");
  const [sleeps, setSleeps] = useState("4");
  const [season, setSeason] = useState("red");
  const [fees, setFees] = useState("");
  const [rating, setRating] = useState("4");
  const [address, setAddress] = useState("");

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imageUrls.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    await addDoc(collection(db, "listings"), {
      storeId,
      category: "timeshare",
      title,
      description,
      price: Number(price),

      // Timeshare fields
      intervalType,
      bedrooms: Number(bedrooms),
      sleeps: Number(sleeps),
      season,
      fees: Number(fees),
      rating: Number(rating),
      address,

      imageUrls,
      status: "active",
      createdAt: serverTimestamp(),
    });

    router.push(`/properties/timeshare`);
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Add Timeshare Listing</h1>

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

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Resort Address</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Interval Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Interval Type</label>
          <select
            value={intervalType}
            onChange={(e) => setIntervalType(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="weekly">Weekly Interval</option>
            <option value="points">Points‑Based</option>
            <option value="fractional">Fractional Ownership</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="0">Studio</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
          </select>
        </div>

        {/* Sleeps */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Sleeps</label>
          <select
            value={sleeps}
            onChange={(e) => setSleeps(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="2">2 Guests</option>
            <option value="4">4 Guests</option>
            <option value="6">6 Guests</option>
            <option value="8">8 Guests</option>
          </select>
        </div>

        {/* Season */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Season</label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="red">Red (Peak)</option>
            <option value="white">White (Mid)</option>
            <option value="blue">Blue (Low)</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>

        {/* Maintenance Fees */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Annual Maintenance Fees</label>
          <input
            type="number"
            required
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Resort Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Resort Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="3">3★</option>
            <option value="4">4★</option>
            <option value="5">5★</option>
          </select>
        </div>

        {/* Images */}
        <UploadListingImages images={imageUrls} setImages={setImageUrls} />

        {/* Submit */}
        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          Create Timeshare Listing
        </button>
      </form>
    </div>
  );
}
