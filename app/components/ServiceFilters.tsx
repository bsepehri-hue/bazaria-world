"use client";

import { useState } from "react";

export default function ServiceFilters({ onChange }: { onChange: (filters: any) => void }) {
  const [filters, setFilters] = useState({
    pricingType: "all",
    rate: "all",
    keywords: "",
  });

  const update = (key: string, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onChange(updated);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border space-y-6">
      {/* Pricing Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Pricing Type</label>
        <select
          value={filters.pricingType}
          onChange={(e) => update("pricingType", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="hourly">Hourly</option>
          <option value="flat">Flat Rate</option>
          <option value="quote">Quote‑Based</option>
        </select>
      </div>

      {/* Rate Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Rate</label>
        <select
          value={filters.rate}
          onChange={(e) => update("rate", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="under-50">Under $50</option>
          <option value="50-100">$50–$100</option>
          <option value="100-200">$100–$200</option>
          <option value="200+">$200+</option>
        </select>
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Keywords</label>
        <input
          type="text"
          placeholder="e.g. plumbing, photography, moving, hair stylist"
          value={filters.keywords}
          onChange={(e) => update("keywords", e.target.value.toLowerCase())}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        />
      </div>
    </div>
  );
}