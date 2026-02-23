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
    <nav className="space-y-2">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.id}
          href={`/${cat.id}`}
          className="block p-2 rounded hover:bg-slate-800 transition"
        >
          {cat.label}
        </Link>
      ))}
    </nav>
  );
}
