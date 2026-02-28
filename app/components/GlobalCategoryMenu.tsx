"use client";

import Link from "next/link";
import { useState } from "react";

const CATEGORIES = [
  {
    id: "art",
    label: "Art",
    sub: [
      { id: "paintings", label: "Paintings" },
      { id: "sculptures", label: "Sculptures" },
      { id: "prints", label: "Prints" },
    ],
  },
  {
    id: "cars",
    label: "Cars",
    sub: [
      { id: "sedan", label: "Sedan" },
      { id: "suv", label: "SUV" },
      { id: "truck", label: "Truck" },
    ],
  },
  {
    id: "general",
    label: "General",
    sub: [
      { id: "electronics", label: "Electronics" },
      { id: "furniture", label: "Furniture" },
      { id: "appliances", label: "Appliances" },
    ],
  },
  {
    id: "homes",
    label: "Homes",
    sub: [
      { id: "forsale", label: "For Sale" },
      { id: "forrent", label: "For Rent" },
    ],
  },
  {
    id: "land",
    label: "Land",
    sub: [
      { id: "residential", label: "Residential" },
      { id: "commercial", label: "Commercial" },
    ],
  },
  {
    id: "motorcycles",
    label: "Motorcycles",
    sub: [
      { id: "sport", label: "Sport" },
      { id: "cruiser", label: "Cruiser" },
    ],
  },
  {
    id: "pets",
    label: "Pets",
    sub: [
      { id: "dogs", label: "Dogs" },
      { id: "cats", label: "Cats" },
      { id: "birds", label: "Birds" },
    ],
  },
  {
    id: "rentals",
    label: "Rentals",
    sub: [
      { id: "shortterm", label: "Short Term" },
      { id: "longterm", label: "Long Term" },
    ],
  },
  {
    id: "rooms",
    label: "Rooms",
    sub: [
      { id: "private", label: "Private Rooms" },
      { id: "shared", label: "Shared Rooms" },
    ],
  },
  {
    id: "rvs",
    label: "RVs",
    sub: [
      { id: "classa", label: "Class A" },
      { id: "classc", label: "Class C" },
    ],
  },
  {
    id: "services",
    label: "Services",
    sub: [
      { id: "home", label: "Home Services" },
      { id: "auto", label: "Auto Services" },
    ],
  },
  {
    id: "timeshare",
    label: "Timeshare",
    sub: [
      { id: "rent", label: "Rent" },
      { id: "sell", label: "Sell" },
    ],
  },
  {
    id: "trucks",
    label: "Trucks",
    sub: [
      { id: "pickup", label: "Pickup" },
      { id: "commercial", label: "Commercial" },
    ],
  },
];

export default function GlobalCategoryMenu() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <nav className="w-full border-b border-slate-800 bg-slate-900">
      <ul className="flex gap-6 px-6 py-3 text-sm font-medium relative">
        {CATEGORIES.map((cat) => (
          <li
            key={cat.id}
            className="relative"
            onMouseEnter={() => setOpen(cat.id)}
            onMouseLeave={() => setOpen(null)}
          >
            <Link
              href={`/${cat.id}`}
              className="text-slate-200 hover:text-white"
            >
              {cat.label}
            </Link>

            {open === cat.id && (
              <ul className="absolute left-0 mt-2 bg-slate-800 shadow-lg rounded p-3 flex flex-col gap-2 z-50 w-40">
                {cat.sub.map((sub) => (
                  <li key={sub.id}>
                    <Link
                      href={`/${cat.id}/${sub.id}`}
                      className="text-slate-200 hover:text-white"
                    >
                      {sub.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
