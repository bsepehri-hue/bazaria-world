"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

import UploadListingImages from "@/components/UploadListingImages";

export default function AddMotorcycleListingPage() {
  const params = useParams<{ storeId: string }>();

if (!params) {
  return <p className="p-6 text-gray-600">Loading…</p>;
}

const { storeId } = params;

const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // Motorcycle‑specific fields
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [type, setType] = useState("cruiser");
  const [cc, setCc] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [transmission, setTransmission] = useState("manual");
  const [drive, setDrive] = useState("chain");
  const [vin, setVin] = useState("");

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imageUrls.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    await addDoc(collection(db, "listings"), {
      storeId,
      category: "motorcycles",
      title,
      description,
      price: Number(price),

      // Motorcycle fields
      make: make.toLowerCase(),
      model: model.toLowerCase(),
      type,
      cc: Number(cc),
      year: Number(year),
      mileage: Number(mileage),
      transmission,
      drive,
      vin,

      imageUrls,
      status: "active",
      createdAt: serverTimestamp(),
    });

    router.push(`/vehicles/motorcycles`);
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Add Motorcycle Listing</h1>

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

        {/* Make */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Make</label>
          <input
            type="text"
            required
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <input
            type="text"
            required
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="cruiser">Cruiser</option>
            <option value="sport">Sport</option>
            <option value="touring">Touring</option>
            <option value="adventure">Adventure</option>
            <option value="dirt">Dirt Bike</option>
            <option value="scooter">Scooter</option>
            <option value="atv">ATV</option>
            <option value="utv">UTV / Side-by-Side</option>
            <option value="three-wheel">Three-Wheeler</option>
          </select>
        </div>

        {/* Engine Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Engine Size (cc)</label>
          <input
            type="number"
            required
            value={cc}
            onChange={(e) => setCc(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="number"
            required
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Mileage */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Mileage</label>
          <input
            type="number"
            required
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Transmission</label>
          <select
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="manual">Manual</option>
            <option value="automatic">Automatic / CVT</option>
          </select>
        </div>

        {/* Drive Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Drive Type</label>
          <select
            value={drive}
            onChange={(e) => setDrive(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="chain">Chain</option>
            <option value="belt">Belt</option>
            <option value="shaft">Shaft</option>
          </select>
        </div>

        {/* VIN */}
        <div>
          <label className="block text-sm font-medium text-gray-700">VIN</label>
          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
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
          Create Motorcycle Listing
        </button>
      </form>
    </div>
  );
}
