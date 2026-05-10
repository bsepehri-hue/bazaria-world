"use client";

import { useState } from "react";

export default function LandFilters({ onChange }: { onChange: (filters: any) => void }) {
  const [filters, setFilters] = useState({
    price: "all",
    lot: "all",
    acres: "all",
    zoning: "all",
    utilities: "all",
    road: "all",
    terrain: "all",
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
          <option value="under-50k">Under $50k</option>
          <option value="50k-150k">$50k–$150k</option>
          <option value="150k-300k">$150k–$300k</option>
          <option value="300k-600k">$300k–$600k</option>
          <option value="600k+">$600k+</option>
        </select>
      </div>

      {/* Lot Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Lot Size (sqft)</label>
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

      {/* Acreage */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Acreage</label>
        <select
          value={filters.acres}
          onChange={(e) => update("acres", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="under-1">Under 1 acre</option>
          <option value="1-5">1–5 acres</option>
          <option value="5-20">5–20 acres</option>
          <option value="20+">20+ acres</option>
        </select>
      </div>

      {/* Zoning */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Zoning</label>
        <select
          value={filters.zoning}
          onChange={(e) => update("zoning", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
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
          value={filters.utilities}
          onChange={(e) => update("utilities", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="none">None</option>
          <option value="partial">Some Available</option>
          <option value="full">Fully Serviced</option>
        </select>
      </div>

      {/* Road Access */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Road Access</label>
        <select
          value={filters.road}
          onChange={(e) => update("road", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
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
          value={filters.terrain}
          onChange={(e) => update("terrain", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="flat">Flat</option>
          <option value="rolling">Rolling</option>
          <option value="hilly">Hilly</option>
          <option value="mountain">Mountain</option>
        </select>
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Keywords</label>
        <input
          type="text"
          placeholder="e.g. farmland, ocean view, subdividable"
          value={filters.keywords}
          onChange={(e) => update("keywords", e.target.value.toLowerCase())}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        />
      </div>
    </div>
  );
}