"use client";

import Link from "next/link";
import { useState } from "react";

// Your real category registry + icons
import { MARKET_CATEGORIES, CategoryIcons } from "@/lib/categories";

export default function GlobalCategoryMenu() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <nav className="w-full border-b border-slate-800 bg-slate-900">
      <ul className="flex gap-6 px-6 py-3 text-sm font-medium relative">
        {MARKET_CATEGORIES.map((cat) => {
          const Icon = CategoryIcons[cat.id]?.default;

          return (
            <li
              key={cat.id}
              className="relative"
              onMouseEnter={() => setOpen(cat.id)}
              onMouseLeave={() => setOpen(null)}
            >
              <Link
                href={`/${cat.id}`}
                className="flex items-center gap-2 text-slate-200 hover:text-white"
              >
                {Icon && <Icon size={18} weight="thin" />}
                {cat.label}
              </Link>

              {open === cat.id && cat.sub && (
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
          );
        })}
      </ul>
    </nav>
  );
}
