"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function EditStorefrontPage() {
 const params = useParams<{ storeId: string }>();

if (!params) {
  return <p className="p-6 text-gray-600">Loading…</p>;
}

const { storeId } = params;

const router = useRouter();

  // Mock storefront data — replace with Firestore later
  const existingStorefront = {
    name: "Bazaria Essentials",
    description: "Your go-to shop for curated essentials.",
    status: "active",
  };

  const [name, setName] = useState(existingStorefront.name);
  const [description, setDescription] = useState(existingStorefront.description);
  const [status, setStatus] = useState(existingStorefront.status);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Placeholder — replace with Firestore update later
    console.log("Saving storefront:", { name, description, status });

    // Redirect back to storefront detail page
    router.push(`/storefronts/${storeId}`);
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">
        Edit Storefront
      </h1>

      <form
        onSubmit={handleSave}
        className="bg-white p-8 rounded-xl shadow border space-y-6"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Storefront Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg h-28 resize-none focus:ring-2 focus:ring-teal-600 focus:outline-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
