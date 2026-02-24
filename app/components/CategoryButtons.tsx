"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const CATEGORIES = [
  "art",
  "cars",
  "general",
  "homes",
  "land",
  "motorcycles",
  "pets",
  "rentals",
  "rooms",
  "rv",
  "services",
  "timeshare",
  "trucks",
];

export default function CategoryButtons() {
  const params = useSearchParams();
  const active = params.get("category");

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;

        return (
          <Link
            key={cat}
            href={`/market?category=${cat}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium border
              ${isActive ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}
            `}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Link>
        );
      })}
    </div>
  );
}
