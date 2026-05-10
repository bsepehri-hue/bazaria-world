"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";


import UploadListingImages from "@/components/UploadListingImages";

export default function AddLandListingPage() {
  const params = useParams<{ storeId: string }>();

if (!params) {
  return <p className="p-6 text-gray-600">Loading…</p>;
}

const { storeId } = params;

const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // Land-specific fields
  const [lot, setLot] = useState("");
  const [acres, setAcres] = useState("");
  const [zoning, setZoning] = useState("residential");
  const [utilities, setUtilities] = useState("none");
  const [road, setRoad] = useState("paved");
  const [terrain, setTerrain] = useState("flat");
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
      category: "land",
      title,
      description,
      price: Number(price),

      // Land fields
      lot: Number(lot),
      acres: Number(acres),
      zoning,
      utilities,
      road,
      terrain,
      address,

      imageUrls,
      status: "active",
      createdAt: serverTimestamp(),
    });

    router.push(`/properties/land`);
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Add Land Listing</h1>

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
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Lot Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Lot Size (sqft)</label>
          <input
            type="number"
            required
            value={lot}
            onChange={(e) => setLot(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Acreage */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Acreage</label>
          <input
            type="number"
            required
            value={acres}
            onChange={(e) => setAcres(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Zoning */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Zoning</label>
          <select
            value={zoning}
            onChange={(e) => setZoning(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="residential">Residential</option>
            <option value="agricultural">Agricultural</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="mixed-use">Mixed‑Use</option>
          </select>
        </div>

        {/* Utilities */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Utilities Available</label>
          <select
            value={utilities}
            onChange={(e) => setUtilities(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="none">None</option>
            <option value="partial">Some Available</option>
            <option value="full">Fully Serviced</option>
          </select>
        </div>

        {/* Road Access */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Road Access</label>
          <select
            value={road}
            onChange={(e) => setRoad(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="paved">Paved Road</option>
            <option value="gravel">Gravel Road</option>
            <option value="dirt">Dirt Road</option>
            <option value="easement">Easement Only</option>
          </select>
        </div>

        {/* Terrain */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Terrain</label>
          <select
            value={terrain}
            onChange={(e) => setTerrain(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="flat">Flat</option>
            <option value="rolling">Rolling</option>
            <option value="hilly">Hilly</option>
            <option value="mountain">Mountain</option>
          </select>
        </div>

        {/* Images */}
        <UploadListingImages images={imageUrls} setImages={setImageUrls} />

        {/* Submit */}
        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          Create Land Listing
        </button>
      </form>
    </div>
  );
}
