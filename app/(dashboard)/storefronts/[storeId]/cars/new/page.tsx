"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";


import UploadListingImages from "@/components/UploadListingImages";

export default function AddCarListingPage() {
  const params = useParams<{ storeId: string }>();

if (!params) {
  return <p className="p-6 text-gray-600">Loading…</p>;
}

const { storeId } = params;

const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // Car‑specific fields
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [body, setBody] = useState("sedan");
  const [fuel, setFuel] = useState("gas");
  const [transmission, setTransmission] = useState("automatic");
  const [drivetrain, setDrivetrain] = useState("fwd");
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
      category: "cars",
      title,
      description,
      price: Number(price),

      // Car fields
      make: make.toLowerCase(),
      model: model.toLowerCase(),
      year: Number(year),
      mileage: Number(mileage),
      body,
      fuel,
      transmission,
      drivetrain,
      vin,

      imageUrls,
      status: "active",
      createdAt: serverTimestamp(),
    });

    router.push(`/vehicles/cars`);
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Add Car Listing</h1>

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

        {/* Body Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Body Type</label>
          <select
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="coupe">Coupe</option>
            <option value="hatchback">Hatchback</option>
            <option value="wagon">Wagon</option>
            <option value="pickup">Pickup</option>
            <option value="van">Van</option>
          </select>
        </div>

        {/* Fuel */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
          <select
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="gas">Gas</option>
            <option value="diesel">Diesel</option>
            <option value="hybrid">Hybrid</option>
            <option value="electric">Electric</option>
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Transmission</label>
          <select
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        {/* Drivetrain */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Drivetrain</label>
          <select
            value={drivetrain}
            onChange={(e) => setDrivetrain(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="fwd">FWD</option>
            <option value="rwd">RWD</option>
            <option value="awd">AWD</option>
            <option value="4wd">4WD</option>
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
          Create Car Listing
        </button>
      </form>
    </div>
  );
}
