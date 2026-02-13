"use client";

import { useState } from "react";
import { createListing } from "./actions";

export default function ListingForm() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await createListing({ title, price, description, category });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ⭐ CATEGORY FIELD — this is the correct location */}
      <div>
        <label className="block font-medium mb-1">Category</label>
        <select
          className="w-full p-3 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select a category...</option>
          <option value="auto">Auto (Cars & Sedans)</option>
          <option value="trucks">Trucks (Pickups & Work Trucks)</option>
          <option value="motorcycles">Motorcycles & Powersports</option>
          <option value="rvs">RVs & Campers</option>
          <option value="properties">Properties (Real Estate)</option>
          <option value="general">General Goods</option>
          <option value="services">Services</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          className="w-full p-3 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Price</label>
        <input
          className="w-full p-3 border rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          className="w-full p-3 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <button
        type="submit"
        className="px-6 py-3 bg-teal-600 text-white rounded hover:bg-teal-700"
      >
        Create Listing
      </button>
    </form>
  );
}
