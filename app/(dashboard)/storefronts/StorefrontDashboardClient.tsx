"use client";

import React from "react";
import Link from "next/link";

export default function StorefrontDashboardClient() {
  // Mock storefronts — replace with Firestore later
  const storefronts = [
    {
      id: "1",
      name: "Bazaria Essentials",
      status: "active",
      owner: "You",
      listings: 12,
    },
    {
      id: "2",
      name: "Vintage Finds",
      status: "paused",
      owner: "You",
      listings: 4,
    },
  ];

  const hasStorefronts = storefronts.length > 0;

  if (!hasStorefronts) {
    return (
      <div className="text-center py-20 border rounded-xl bg-white">
        <p className="text-gray-600 text-lg">You don’t have any storefronts yet.</p>
        <Link
          href="/dashboard/storefronts/new"
          className="mt-4 inline-block px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          Create Your First Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {storefronts.map((store) => (
        <div
          key={store.id}
          className="bg-white p-6 rounded-xl shadow border hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">{store.name}</h3>

            <span
              className={`px-3 py-1 text-xs rounded-full ${
                store.status === "active"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {store.status}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-1">Owner: {store.owner}</p>
          <p className="text-sm text-gray-500">Listings: {store.listings}</p>

          <Link
            href={`/dashboard/storefronts/${store.id}`}
            className="mt-4 inline-block text-teal-600 hover:text-teal-800 font-medium text-sm"
          >
            Manage Storefront →
          </Link>
        </div>
      ))}
    </div>
  );
}