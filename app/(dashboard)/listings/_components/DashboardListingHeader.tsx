"use client";

import Link from "next/link";

export default function DashboardListingHeader({ listing }) {
  return (
    <div className="mb-8">
      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>

      {/* VIEW PUBLIC PAGE */}
      <Link
        href={`/listing/${listing.id}`}
        className="inline-block text-teal-600 underline hover:text-teal-700 mb-4"
      >
        View Public Page
      </Link>

      {/* OPTIONAL: STATUS BADGE */}
      {listing.status && (
        <span
          className={`ml-4 px-3 py-1 text-sm rounded ${
            listing.status === "active"
              ? "bg-emerald-100 text-emerald-700"
              : listing.status === "sold"
              ? "bg-gray-200 text-gray-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {listing.status}
        </span>
      )}
    </div>
  );
}
