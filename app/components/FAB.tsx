"use client";

import { useState } from "react";
import Link from "next/link";

export default function FAB() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9998]">
      
      {/* Action Menu */}
      {open && (
        <div className="mb-3 space-y-3">
          <Link
            href="/dashboard/listings/create"
            className="block px-4 py-2 rounded-lg shadow-lg bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Create Listing
          </Link>

          <Link
            href="/dashboard/auctions/create"
            className="block px-4 py-2 rounded-lg shadow-lg bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Start Auction
          </Link>

          <Link
            href="/dashboard/messages/new"
            className="block px-4 py-2 rounded-lg shadow-lg bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            New Message
          </Link>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="h-14 w-14 rounded-full bg-teal-600 text-white shadow-xl flex items-center justify-center hover:bg-teal-700 transition"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )}
      </button>
    </div>
  );
}