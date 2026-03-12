// components/marketplace/CategoryBar.tsx

"use client";

import { MARKET_CATEGORIES } from "@/lib/categories";

export default function CategoryBar({ active, onSelect }) {
  return (
    <div className="category-bar">

      {/* ALL */}
      <button
        className={`category-item ${active === null ? "active" : ""}`}
        onClick={() => onSelect(null)}
      >
        <span className="category-icon">🌐</span>
        <span className="category-label">All</span>
      </button>

      {/* DYNAMIC CATEGORIES FROM MARKET_CATEGORIES */}
      {MARKET_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          className={`category-item ${active === cat.id ? "active" : ""}`}
          onClick={() => onSelect(cat.id)}
        >
         <cat.icon className="category-icon w-5 h-5" weight="regular" />
          <span className="category-label">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
