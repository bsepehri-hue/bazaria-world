"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function NewPropertyListingPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("house");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [sqft, setSqft] = useState("");
  const [lotSize, setLotSize] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [condition, setCondition] = useState("good");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "listings"), {
        title,
        price: Number(price),
        type,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        sqft: Number(sqft),
        lotSize: lotSize ? Number(lotSize) : null,
        yearBuilt: yearBuilt ? Number(yearBuilt) : null,
        condition,
        location,
        description,
        category: "properties",
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
      <h1 className="text-2xl font-semibold mb-4">Create Property Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Price */}
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

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Property Type</label>
          <select
            className="w-full border p-2 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        {/* Bedrooms + Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bedrooms</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bathrooms</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Square Footage */}
        <div>
          <label className="block text-sm font-medium mb-1">Square Footage</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={sqft}
            onChange={(e) => setSqft(e.target.value)}
            required
          />
        </div>

        {/* Lot Size (optional) */}
        <div>
          <label className="block text-sm font-medium mb-1">Lot Size (sqft)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={lotSize}
            onChange={(e) => setLotSize(e.target.value)}
          />
        </div>

        {/* Year Built (optional) */}
        <div>
          <label className="block text-sm font-medium mb-1">Year Built</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={yearBuilt}
            onChange={(e) => setYearBuilt(e.target.value)}
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium mb-1">Condition</label>
          <select
            className="w-full border p-2 rounded"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="needs_work">Needs Work</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            className="w-full border p-2 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border p-2 rounded h-28"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Submit */}
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
