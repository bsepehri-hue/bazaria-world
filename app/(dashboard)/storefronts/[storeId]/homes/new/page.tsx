"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";


import UploadListingImages from "@/components/UploadListingImages";

export default function AddHomeListingPage() {
  const params = useParams<{ storeId: string }>();

if (!params) {
  return <p className="p-6 text-gray-600">Loading…</p>;
}

const { storeId } = params;

const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // Home-specific fields
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [sqft, setSqft] = useState("");
  const [lot, setLot] = useState("");
  const [type, setType] = useState("single-family");
  const [yearBuilt, setYearBuilt] = useState("");
  const [parking, setParking] = useState("garage");
  const [hoa, setHoa] = useState("");
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
      category: "homes",
      title,
      description,
      price: Number(price),

      // Home fields
      beds: Number(beds),
      baths: Number(baths),
      sqft: Number(sqft),
      lot: Number(lot),
      type,
      yearBuilt: Number(yearBuilt),
      parking,
      hoa: Number(hoa),
      address,

      imageUrls,
      status: "active",
      createdAt: serverTimestamp(),
    });

    router.push(`/properties/homes`);
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Add Home Listing</h1>

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

        {/* Beds */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
          <input
            type="number"
            required
            value={beds}
            onChange={(e) => setBeds(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Baths */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
          <input
            type="number"
            required
            value={baths}
            onChange={(e) => setBaths(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Sqft */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Square Feet</label>
          <input
            type="number"
            required
            value={sqft}
            onChange={(e) => setSqft(e.target.value)}
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

        {/* Home Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Home Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="single-family">Single‑Family</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
            <option value="multi-unit">Multi‑Unit</option>
          </select>
        </div>

        {/* Year Built */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Year Built</label>
          <input
            type="number"
            required
            value={yearBuilt}
            onChange={(e) => setYearBuilt(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Parking */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Parking</label>
          <select
            value={parking}
            onChange={(e) => setParking(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="garage">Garage</option>
            <option value="carport">Carport</option>
            <option value="street">Street Parking</option>
          </select>
        </div>

        {/* HOA */}
        <div>
          <label className="block text-sm font-medium text-gray-700">HOA Fee (monthly)</label>
          <input
            type="number"
            value={hoa}
            onChange={(e) => setHoa(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Images */}
        <UploadListingImages images={imageUrls} setImages={setImageUrls} />

        {/* Submit */}
        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          Create Home Listing
        </button>
      </form>
    </div>
  );
}
