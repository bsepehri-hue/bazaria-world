"use client";

import { useState } from "react";

export default function TruckFilters({ onChange }: { onChange: (filters: any) => void }) {
  const [filters, setFilters] = useState({
    make: "all",
    model: "all",
    year: "all",
    mileage: "all",
    fuel: "all",
    transmission: "all",
    drivetrain: "all",
    bed: "all",
    cab: "all",
    tow: "all",
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
          placeholder="e.g. Ford"
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
          placeholder="e.g. F-150"
          value={filters.model}
          onChange={(e) => update("model", e.target.value.toLowerCase())}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        />
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
          <option value="rwd">RWD</option>
          <option value="awd">AWD</option>
          <option value="4wd">4WD</option>
        </select>
      </div>

      {/* Bed Length */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Bed Length</label>
        <select
          value={filters.bed}
          onChange={(e) => update("bed", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="short">Short Bed</option>
          <option value="standard">Standard Bed</option>
          <option value="long">Long Bed</option>
        </select>
      </div>

      {/* Cab Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Cab Type</label>
        <select
          value={filters.cab}
          onChange={(e) => update("cab", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="regular">Regular Cab</option>
          <option value="extended">Extended Cab</option>
          <option value="crew">Crew Cab</option>
        </select>
      </div>

      {/* Towing Capacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Towing Capacity</label>
        <select
          value={filters.tow}
          onChange={(e) => update("tow", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="under-5000">Under 5,000 lbs</option>
          <option value="5000-10000">5,000–10,000 lbs</option>
          <option value="10000-15000">10,000–15,000 lbs</option>
          <option value="15000+">15,000+ lbs</option>
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
          <option value="under-10000">Under $10,000</option>
          <option value="10000-20000">$10,000–$20,000</option>
          <option value="20000-35000">$20,000–$35,000</option>
          <option value="35000-50000">$35,000–$50,000</option>
          <option value="50000+">$50,000+</option>
        </select>
      </div>
    </div>
  );
}