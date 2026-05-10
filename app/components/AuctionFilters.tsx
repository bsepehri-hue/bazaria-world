"use client";

import { useState } from "react";

export default function AuctionFilters({ onChange }: { onChange: (filters: any) => void }) {
  const [filters, setFilters] = useState({
    sort: "ending-soon",
    reserve: "all",
    buyNow: "all",
    price: "all",
    keywords: "",
  });

  const update = (key: string, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onChange(updated);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border space-y-6">
      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Sort</label>
        <select
          value={filters.sort}
          onChange={(e) => update("sort", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="ending-soon">Ending Soon</option>
          <option value="newly-listed">Newly Listed</option>
        </select>
      </div>

      {/* Reserve */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Reserve</label>
        <select
          value={filters.reserve}
          onChange={(e) => update("reserve", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="met">Reserve Met</option>
        </select>
      </div>

      {/* Buy It Now */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Buy It Now</label>
        <select
          value={filters.buyNow}
          onChange={(e) => update("buyNow", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="available">Available</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Current Bid</label>
        <select
          value={filters.price}
          onChange={(e) => update("price", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="under-50">Under $50</option>
          <option value="50-100">$50–$100</option>
          <option value="100-250">$100–$250</option>
          <option value="250-500">$250–$500</option>
          <option value="500+">$500+</option>
        </select>
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Keywords</label>
        <input
          type="text"
          placeholder="e.g. iPhone, tools, collectibles"
          value={filters.keywords}
          onChange={(e) => update("keywords", e.target.value.toLowerCase())}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        />
      </div>
    </div>
  );
}