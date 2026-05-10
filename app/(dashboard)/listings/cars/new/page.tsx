"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function NewCarListingPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [mileage, setMileage] = useState("");
  const [condition, setCondition] = useState("used");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [vin, setVin] = useState("");
  const [odometer, setOdometer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "listings"), {
        title,
        price: Number(price),
        year,
        make,
        model,
        mileage,
        condition,
        description,
        location,
        vin,
        odometer: Number(odometer),
        category: "cars",
        createdAt: serverTimestamp(),
      });

      setLoading(false);
      alert("Listing created!");
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Error creating listing.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Car Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
  <label className="block text-sm font-medium mb-1">Price</label>
  <input
    type="number"
    className="w-full border p-2 rounded"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
    required
  />
</div>

<div>
  <label className="block text-sm font-medium mb-1">VIN (Required)</label>
  <input
    className="w-full border p-2 rounded"
    value={vin}
    onChange={(e) => setVin(e.target.value)}
    required
  />
</div>

<div>
  <label className="block text-sm font-medium mb-1">Odometer (Required)</label>
  <input
    type="number"
    className="w-full border p-2 rounded"
    value={odometer}
    onChange={(e) => setOdometer(e.target.value)}
    required
  />
</div>

<div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium mb-1">Year</label>
    <input
      className="w-full border p-2 rounded"
      value={year}
      onChange={(e) => setYear(e.target.value)}
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Make</label>
    <input
      className="w-full border p-2 rounded"
      value={make}
      onChange={(e) => setMake(e.target.value)}
      required
    />
  </div>
</div>

        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <input
            className="w-full border p-2 rounded"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mileage</label>
          <input
            className="w-full border p-2 rounded"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Condition</label>
          <select
            className="w-full border p-2 rounded"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="used">Used</option>
            <option value="new">New</option>
            <option value="salvage">Salvage</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            className="w-full border p-2 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border p-2 rounded h-28"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>
</form>
</div>
);
}
