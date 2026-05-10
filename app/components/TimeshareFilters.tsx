"use client";

import { useState } from "react";

export default function TimeshareFilters({ onChange }: { onChange: (filters: any) => void }) {
  const [filters, setFilters] = useState({
    price: "all",
    intervalType: "all",
    bedrooms: "all",
    sleeps: "all",
    season: "all",
    fees: "all",
    rating: "all",
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
          <option value="under-5k">Under $5,000</option>
          <option value="5k-10k">$5,000–$10,000</option>
          <option value="10k-20k">$10,000–$20,000</option>
          <option value="20k+">$20,000+</option>
        </select>
      </div>

      {/* Interval Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Interval Type</label>
        <select
          value={filters.intervalType}
          onChange={(e) => update("intervalType", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="weekly">Weekly Interval</option>
          <option value="points">Points‑Based</option>
          <option value="fractional">Fractional Ownership</option>
        </select>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
        <select
          value={filters.bedrooms}
          onChange={(e) => update("bedrooms", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="0">Studio</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>
      </div>

      {/* Sleeps */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Sleeps</label>
        <select
          value={filters.sleeps}
          onChange={(e) => update("sleeps", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="2">2+</option>
          <option value="4">4+</option>
          <option value="6">6+</option>
          <option value="8">8+</option>
        </select>
      </div>

      {/* Season */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Season</label>
        <select
          value={filters.season}
          onChange={(e) => update("season", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="red">Red (Peak)</option>
          <option value="white">White (Mid)</option>
          <option value="blue">Blue (Low)</option>
          <option value="gold">Gold</option>
          <option value="platinum">Platinum</option>
        </select>
      </div>

      {/* Maintenance Fees */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Maintenance Fees</label>
        <select
          value={filters.fees}
          onChange={(e) => update("fees", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="under-500">Under $500</option>
          <option value="500-1000">$500–$1,000</option>
          <option value="1000-1500">$1,000–$1,500</option>
          <option value="1500+">$1,500+</option>
        </select>
      </div>

      {/* Resort Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Resort Rating</label>
        <select
          value={filters.rating}
          onChange={(e) => update("rating", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="3">3★+</option>
          <option value="4">4★+</option>
          <option value="5">5★</option>
        </select>
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Keywords</label>
        <input
          type="text"
          placeholder="e.g. beachfront, ski week, Disney, Marriott"
          value={filters.keywords}
          onChange={(e) => update("keywords", e.target.value.toLowerCase())}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        />
      </div>
    </div>
  );
}