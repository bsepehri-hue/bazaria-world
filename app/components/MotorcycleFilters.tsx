"use client";

import { useState } from "react";

export default function MotorcycleFilters({ onChange }: { onChange: (filters: any) => void }) {
  const [filters, setFilters] = useState({
    make: "all",
    model: "all",
    type: "all",
    cc: "all",
    year: "all",
    mileage: "all",
    transmission: "all",
    drive: "all",
    price: "all",
  });

  const update = (key: string, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onChange(updated);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border space-y-6">
      {/* Make */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Make</label>
        <input
          type="text"
          placeholder="e.g. Honda"
          value={filters.make}
          onChange={(e) => update("make", e.target.value.toLowerCase())}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Model */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Model</label>
        <input
          type="text"
          placeholder="e.g. CBR600"
          value={filters.model}
          onChange={(e) => update("model", e.target.value.toLowerCase())}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={filters.type}
          onChange={(e) => update("type", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="cruiser">Cruiser</option>
          <option value="sport">Sport</option>
          <option value="touring">Touring</option>
          <option value="adventure">Adventure</option>
          <option value="dirt">Dirt Bike</option>
          <option value="scooter">Scooter</option>
          <option value="atv">ATV</option>
          <option value="utv">UTV / Side-by-Side</option>
          <option value="three-wheel">Three-Wheeler</option>
        </select>
      </div>

      {/* Engine Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Engine Size (cc)</label>
        <select
          value={filters.cc}
          onChange={(e) => update("cc", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="under-250">Under 250cc</option>
          <option value="250-500">250–500cc</option>
          <option value="500-750">500–750cc</option>
          <option value="750-1000">750–1000cc</option>
          <option value="1000+">1000cc+</option>
        </select>
      </div>

      {/* Year */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Year</label>
        <select
          value={filters.year}
          onChange={(e) => update("year", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="2010+">2010+</option>
          <option value="2015+">2015+</option>
          <option value="2020+">2020+</option>
        </select>
      </div>

      {/* Mileage */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Mileage</label>
        <select
          value={filters.mileage}
          onChange={(e) => update("mileage", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="under-5k">Under 5k</option>
          <option value="5k-15k">5k–15k</option>
          <option value="15k-30k">15k–30k</option>
          <option value="30k+">30k+</option>
        </select>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Transmission</label>
        <select
          value={filters.transmission}
          onChange={(e) => update("transmission", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="manual">Manual</option>
          <option value="automatic">Automatic / CVT</option>
        </select>
      </div>

      {/* Drive Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Drive Type</label>
        <select
          value={filters.drive}
          onChange={(e) => update("drive", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="chain">Chain</option>
          <option value="belt">Belt</option>
          <option value="shaft">Shaft</option>
        </select>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <select
          value={filters.price}
          onChange={(e) => update("price", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="under-3000">Under $3,000</option>
          <option value="3000-6000">$3,000–$6,000</option>
          <option value="6000-10000">$6,000–$10,000</option>
          <option value="10000+">$10,000+</option>
        </select>
      </div>
    </div>
  );
}