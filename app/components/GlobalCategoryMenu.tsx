"use client";

import Link from "next/link";

const CATEGORIES = [
  { id: "art", label: "Art" },
  { id: "cars", label: "Cars" },
  { id: "general", label: "General" },
  { id: "homes", label: "Homes" },
  { id: "land", label: "Land" },
  { id: "motorcycles", label: "Motorcycles" },
  { id: "pets", label: "Pets" },
  { id: "rentals", label: "Rentals" },
  { id: "rooms", label: "Rooms" },
  { id: "rvs", label: "RVs" },
  { id: "services", label: "Services" },
  { id: "timeshare", label: "Timeshare" },
  { id: "trucks", label: "Trucks" },
];

export default function GlobalCategoryMenu() {
  return (
    <nav className="w-full border-b border-slate-800 bg-slate-900">
      <ul className="flex flex-wrap gap-4 px-6 py-3 text-sm font-medium">
        {CATEGORIES.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`/${cat.id}`}
              className="text-slate-200 hover:text-white hover:underline"
            >
              {cat.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
