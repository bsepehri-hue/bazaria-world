"use client";

import { useState } from "react";
import { createListing } from "./actions";

export default function ListingForm() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await createListing({ title, price, description });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
