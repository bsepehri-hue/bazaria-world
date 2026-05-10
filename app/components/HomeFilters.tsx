"use client";

import { useState } from "react";

export default function HomeFilters({ onChange }: { onChange: (filters: any) => void }) {
  const [filters, setFilters] = useState({
    price: "all",
    beds: "all",
    baths: "all",
    sqft: "all",
    lot: "all",
    type: "all",
    year: "all",
    parking: "all",
    hoa: "all",
    keywords: "",
  });

  function update(key: string, value: any) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onChange(next);
  }

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
          <option value="under-250k">Under $250k</option>
          <option value="250k-500k">$250k–$500k</option>
          <option value="500k-750k">$500k–$750k</option>
          <option value="750k-1m">$750k–$1M</option>
          <option value="1m+">$1M+</option>
        </select>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
        <select
          value={filters.beds}
          onChange={(e) => update("beds", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>

      {/* Bathrooms */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
        <select
          value={filters.baths}
          onChange={(e) => update("baths", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      {/* Square Feet */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Square Feet</label>
        <select
          value={filters.sqft}
          onChange={(e) => update("sqft", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="under-1000">Under 1,000 sqft</option>
          <option value="1000-2000">1,000–2,000 sqft</option>
          <option value="2000-3000">2,000–3,000 sqft</option>
          <option value="3000+">3,000+ sqft</option>
        </select>
      </div>

      {/* Lot Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Lot Size</label>
        <select
          value={filters.lot}
          onChange={(e) => update("lot", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="under-5000">Under 5,000 sqft</option>
          <option value="5000-10000">5,000–10,000 sqft</option>
          <option value="10000-20000">10,000–20,000 sqft</option>
          <option value="20000+">20,000+ sqft</option>
        </select>
      </div>

      {/* Home Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Home Type</label>
        <select
          value={filters.type}
          onChange={(e) => update("type", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="single-family">Single‑Family</option>
          <option value="condo">Condo</option>
          <option value="townhouse">Townhouse</option>
          <option value="multi-unit">Multi‑Unit</option>
        </select>
      </div>

      {/* Year Built */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Year Built</label>
        <select
          value={filters.year}
          onChange={(e) => update("year", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="1980+">1980+</option>
          <option value="1990+">1990+</option>
          <option value="2000+">2000+</option>
          <option value="2010+">2010+</option>
        </select>
      </div>

      {/* Parking */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Parking</label>
        <select
          value={filters.parking}
          onChange={(e) => update("parking", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="garage">Garage</option>
          <option value="carport">Carport</option>
          <option value="street">Street Parking</option>
        </select>
      </div>

      {/* HOA */}
      <div>
        <label className="block text-sm font-medium text-gray-700">HOA Fee</label>
        <select
          value={filters.hoa}
          onChange={(e) => update("hoa", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="none">No HOA</option>
          <option value="under-200">Under $200/mo</option>
          <option value="200-400">$200–$400/mo</option>
          <option value="400+">$400+/mo</option>
        </select>
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Keywords</label>
        <input
          type="text"
          placeholder="e.g. pool, remodeled, ocean view"
          value={filters.keywords}
          onChange={(e) => update("keywords", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        />
      </div>

    </div>
  );
}
