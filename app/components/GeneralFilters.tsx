"use client";

import { useState } from "react";

export default function GeneralFilters({ onChange }: { onChange: (filters: any) => void }) {
  const [filters, setFilters] = useState({
    price: "all",
    condition: "all",
    brand: "",
    keywords: "",
  });

  const update = (key: string, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onChange(updated);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border space-y-6">
      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <select
          value={filters.price}
          onChange={(e) => update("price", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="under-20">Under $20</option>
          <option value="20-50">$20–$50</option>
          <option value="50-100">$50–$100</option>
          <option value="100-250">$100–$250</option>
          <option value="250-500">$250–$500</option>
          <option value="500+">$500+</option>
        </select>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Condition</label>
        <select
          value={filters.condition}
          onChange={(e) => update("condition", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="new">New</option>
          <option value="like-new">Like New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
        </select>
      </div>

      {/* Brand */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Brand</label>
        <input
          type="text"
          placeholder="e.g. Apple, Nike, Samsung"
          value={filters.brand}
          onChange={(e) => update("brand", e.target.value.toLowerCase())}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Keywords</label>
        <input
          type="text"
          placeholder="e.g. gaming chair, DSLR, sofa"
          value={filters.keywords}
          onChange={(e) => update("keywords", e.target.value.toLowerCase())}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        />
      </div>
    </div>
  );
}