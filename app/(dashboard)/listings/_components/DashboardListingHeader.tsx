"use client";

import Link from "next/link";

export default function DashboardListingHeader({ listing }) {
  return (
    <div className="mb-8">
      {/* TITLE */}
     <div className="flex items-center gap-3 mb-2">
  <h1 className="text-3xl font-bold">{listing.title}</h1>

  {listing.status === "sold" && (
    <span className="px-3 py-1 text-sm font-semibold bg-amber-600 text-white rounded-full">
      SOLD
    </span>
  )}
</div>

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
