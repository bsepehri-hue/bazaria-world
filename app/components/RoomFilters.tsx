"use client";

import { useState } from "react";

export default function RoomFilters({ onChange }: { onChange: (filters: any) => void }) {
  const [filters, setFilters] = useState({
    price: "all",
    roomType: "all",
    bathType: "all",
    sqft: "all",
    lease: "all",
    pets: "all",
    parking: "all",
    utilities: "all",
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
        <label className="block text-sm font-medium text-gray-700">Monthly Price</label>
        <select
          value={filters.price}
          onChange={(e) => update("price", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="under-800">Under $800</option>
          <option value="800-1200">$800–$1,200</option>
          <option value="1200-1800">$1,200–$1,800</option>
          <option value="1800+">$1,800+</option>
        </select>
      </div>

      {/* Room Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Room Type</label>
        <select
          value={filters.roomType}
          onChange={(e) => update("roomType", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="private">Private Room</option>
          <option value="shared">Shared Room</option>
        </select>
      </div>

      {/* Bathroom Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Bathroom Type</label>
        <select
          value={filters.bathType}
          onChange={(e) => update("bathType", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="private">Private Bathroom</option>
          <option value="shared">Shared Bathroom</option>
        </select>
      </div>

      {/* Sqft */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Square Feet</label>
        <select
          value={filters.sqft}
          onChange={(e) => update("sqft", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="under-150">Under 150 sqft</option>
          <option value="150-250">150–250 sqft</option>
          <option value="250-400">250–400 sqft</option>
          <option value="400+">400+ sqft</option>
        </select>
      </div>

      {/* Lease Length */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Lease Length</label>
        <select
          value={filters.lease}
          onChange={(e) => update("lease", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="month-to-month">Month‑to‑Month</option>
          <option value="6-month">6‑Month</option>
          <option value="12-month">12‑Month</option>
          <option value="long-term">Long‑Term</option>
        </select>
      </div>

      {/* Pet Policy */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Pet Policy</label>
        <select
          value={filters.pets}
          onChange={(e) => update("pets", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="no-pets">No Pets</option>
          <option value="cats-ok">Cats OK</option>
          <option value="dogs-ok">Dogs OK</option>
          <option value="pets-ok">Pets Allowed</option>
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

      {/* Utilities Included */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Utilities Included</label>
        <select
          value={filters.utilities}
          onChange={(e) => update("utilities", e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">Any</option>
          <option value="none">None</option>
          <option value="some">Some Included</option>
          <option value="all">All Included</option>
        </select>
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Keywords</label>
        <input
          type="text"
          placeholder="e.g. furnished, near campus, quiet"
          value={filters.keywords}
          onChange={(e) => update("keywords", e.target.value.toLowerCase())}
          className="mt-2 w-full px-4 py-2 border rounded-lg"
        />
      </div>
    </div>
  );
}