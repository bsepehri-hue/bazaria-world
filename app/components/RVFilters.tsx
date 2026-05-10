"use client";

import { useState } from "react";

export default function RVFilters({ onChange }: { onChange: (filters: any) => void }) {
  const [filters, setFilters] = useState({
    type: "all",
    sleeps: "all",
    length: "all",
    weight: "all",
    towable: "all",
    price: "all",
    slideouts: "all",
    fuel: "all",
    year: "all",
    mileage: "all",
  });

  const update = (key: string, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onChange(updated);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border space-y-6">
      {/* RV Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">RV Type</label>
        <select
          value={filters.type}
          onChange={(e) => update("type", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">All Types</option>
          <option value="travel-trailer">Travel Trailer</option>
          <option value="fifth-wheel">Fifth Wheel</option>
          <option value="toy-hauler">Toy Hauler</option>
          <option value="pop-up">Pop-Up</option>
          <option value="teardrop">Teardrop</option>
          <option value="class-a">Class A</option>
          <option value="class-b">Class B</option>
          <option value="class-c">Class C</option>
          <option value="super-c">Super C</option>
          <option value="truck-camper">Truck Camper</option>
          <option value="overland">Overland Rig</option>
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
          <option value="1-2">1–2</option>
          <option value="3-4">3–4</option>
          <option value="5-6">5–6</option>
          <option value="7+">7+</option>
        </select>
      </div>

      {/* Length */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Length</label>
        <select
          value={filters.length}
          onChange={(e) => update("length", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="under-20">Under 20 ft</option>
          <option value="20-25">20–25 ft</option>
          <option value="26-30">26–30 ft</option>
          <option value="31-35">31–35 ft</option>
          <option value="36+">36+ ft</option>
        </select>
      </div>

      {/* Weight */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Weight</label>
        <select
          value={filters.weight}
          onChange={(e) => update("weight", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="under-3500">Under 3,500 lbs</option>
          <option value="3500-5000">3,500–5,000 lbs</option>
          <option value="5000-7500">5,000–7,500 lbs</option>
          <option value="7500-10000">7,500–10,000 lbs</option>
          <option value="10000+">10,000+ lbs</option>
        </select>
      </div>

      {/* Towable vs Motorized */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Towable / Motorized</label>
        <select
          value={filters.towable}
          onChange={(e) => update("towable", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="towable">Towable</option>
          <option value="motorized">Motorized</option>
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
          <option value="10000-25000">$10,000–$25,000</option>
          <option value="25000-50000">$25,000–$50,000</option>
          <option value="50000-100000">$50,000–$100,000</option>
          <option value="100000+">$100,000+</option>
        </select>
      </div>

      {/* Slide-Outs */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Slide-Outs</label>
        <select
          value={filters.slideouts}
          onChange={(e) => update("slideouts", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3+">3+</option>
        </select>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Fuel Type (Motorized)</label>
        <select
          value={filters.fuel}
          onChange={(e) => update("fuel", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="gas">Gas</option>
          <option value="diesel">Diesel</option>
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
        <label className="block text-sm font-medium text-gray-700">Mileage (Motorized)</label>
        <select
          value={filters.mileage}
          onChange={(e) => update("mileage", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="under-25k">Under 25k</option>
          <option value="25k-50k">25k–50k</option>
          <option value="50k-100k">50k–100k</option>
          <option value="100k+">100k+</option>
        </select>
      </div>
    </div>
  );
}