"use client";

import { useState } from "react";

export default function CarFilters({ onChange }: { onChange: (filters: any) => void }) {
  const [filters, setFilters] = useState({
    make: "all",
    model: "all",
    body: "all",
    fuel: "all",
    transmission: "all",
    drivetrain: "all",
    year: "all",
    mileage: "all",
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
          placeholder="e.g. Toyota"
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
          placeholder="e.g. Camry"
          value={filters.model}
          onChange={(e) => update("model", e.target.value.toLowerCase())}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Body Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Body Type</label>
        <select
          value={filters.body}
          onChange={(e) => update("body", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="sedan">Sedan</option>
          <option value="suv">SUV</option>
          <option value="coupe">Coupe</option>
          <option value="hatchback">Hatchback</option>
          <option value="wagon">Wagon</option>
          <option value="pickup">Pickup</option>
          <option value="van">Van</option>
        </select>
      </div>

      {/* Fuel */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
        <select
          value={filters.fuel}
          onChange={(e) => update("fuel", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="gas">Gas</option>
          <option value="diesel">Diesel</option>
          <option value="hybrid">Hybrid</option>
          <option value="electric">Electric</option>
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
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      {/* Drivetrain */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Drivetrain</label>
        <select
          value={filters.drivetrain}
          onChange={(e) => update("drivetrain", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="fwd">FWD</option>
          <option value="rwd">RWD</option>
          <option value="awd">AWD</option>
          <option value="4wd">4WD</option>
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
          <option value="under-50k">Under 50k</option>
          <option value="50k-100k">50k–100k</option>
          <option value="100k-150k">100k–150k</option>
          <option value="150k+">150k+</option>
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
          <option value="under-5000">Under $5,000</option>
          <option value="5000-10000">$5,000–$10,000</option>
          <option value="10000-20000">$10,000–$20,000</option>
          <option value="20000-35000">$20,000–$35,000</option>
          <option value="35000-50000">$35,000–$50,000</option>
          <option value="50000+">$50,000+</option>
        </select>
      </div>
    </div>
  );
}