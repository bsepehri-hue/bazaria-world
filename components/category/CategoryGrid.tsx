// components/category/CategoryGrid.tsx

import Link from "next/link";
import { CategoryIcons } from "@/components/icons/CategoryIcons";
import { MARKET_CATEGORIES } from "@/lib/categories";

export default function CategoryGrid({ activeCategory }) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {MARKET_CATEGORIES.map((cat) => {
        const Icon = activeCategory === cat.id
          ? CategoryIcons[cat.id].active
          : CategoryIcons[cat.id].default;

        const isActive = activeCategory === cat.id;

        return (
          <Link
            key={cat.id}
            href={`/market?category=${cat.id}`}
            className={`flex flex-col items-center p-4 rounded-lg border transition
              ${isActive ? "bg-black text-white" : "bg-white text-black"}
              hover:shadow-md hover:scale-[1.03]`}
          >
            <Icon className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">{cat.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
