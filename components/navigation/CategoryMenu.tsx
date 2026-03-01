"use client";

import Link from "next/link";
import { CategoryIcons } from "@/components/IconSet";

const categories = [
  { id: "cars", label: "Cars" },
  { id: "homes", label: "Homes" },
  { id: "pets", label: "Pets" },
  { id: "rentals", label: "Rentals" },
  { id: "rooms", label: "Rooms" },
  { id: "land", label: "Land" },
  { id: "motorcycles", label: "Motorcycles" },
  { id: "rvs", label: "RVs" },
  { id: "trucks", label: "Trucks" },
  { id: "timeshare", label: "Timeshare" },
  { id: "services", label: "Services" },
  { id: "general", label: "General" },
  { id: "art", label: "Art" },
];

export default function CategoryMenu() {
  return (
    <nav className="w-full border-b border-slate-800 bg-black">
      <ul className="flex items-center gap-8 px-8 py-4 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const Icon = CategoryIcons[cat.id];

          return (
            <li key={cat.id}>
              <Link
  href={`/market/${cat.id}`}
  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
>
  <div className="w-5 h-5 bg-red-500"></div>
  <span className="whitespace-nowrap">{cat.label}</span>
</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
