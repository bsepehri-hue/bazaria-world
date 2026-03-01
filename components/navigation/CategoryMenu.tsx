"use client";

import { useState } from "react";
import Link from "next/link";
import { CategoryIcons } from "../IconSet";

const categories = [
  {
    id: "cars",
    label: "Cars",
    sub: [
      { id: "sedan", label: "Sedan" },
      { id: "suv", label: "SUV" },
      { id: "truck", label: "Trucks" },
    ],
  },
  {
    id: "homes",
    label: "Homes",
    sub: [
      { id: "rent", label: "For Rent" },
      { id: "sale", label: "For Sale" },
    ],
  },
  {
    id: "pets",
    label: "Pets",
    sub: [
      { id: "dogs", label: "Dogs" },
      { id: "cats", label: "Cats" },
    ],
  },
  { id: "rentals", label: "Rentals", sub: [] },
  { id: "rooms", label: "Rooms", sub: [] },
  { id: "land", label: "Land", sub: [] },
  { id: "motorcycles", label: "Motorcycles", sub: [] },
  { id: "rvs", label: "RVs", sub: [] },
  { id: "trucks", label: "Trucks", sub: [] },
  { id: "timeshare", label: "Timeshare", sub: [] },
  { id: "services", label: "Services", sub: [] },
  { id: "general", label: "General", sub: [] },
  { id: "art", label: "Art", sub: [] },
];

export default function CategoryMenu() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <nav className="w-full border-b border-slate-800 bg-black">
      <ul className="flex items-center gap-8 px-8 py-4 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const Icon = CategoryIcons[cat.id];

          return (
            <li
              key={cat.id}
              className="relative"
              onMouseEnter={() => setOpen(cat.id)}
              onMouseLeave={() => setOpen(null)}
            >
              <Link
                href={`/market/${cat.id}`}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="whitespace-nowrap">{cat.label}</span>
              </Link>

              {open === cat.id && cat.sub.length > 0 && (
                <div className="absolute left-0 mt-2 bg-black border border-slate-800 rounded-lg shadow-lg p-3 space-y-2 z-50">
                  {cat.sub.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/market/${cat.id}/${sub.id}`}
                      className="block text-slate-300 hover:text-white transition-colors whitespace-nowrap"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
