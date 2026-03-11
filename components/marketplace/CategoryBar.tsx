// components/marketplace/CategoryBar.tsx

"use client";

import { categoryList } from "@/data/categories"; // your icon+label map

export default function CategoryBar({ active, onSelect }) {
  return (
    <div className="category-bar">
      {categoryList.map((cat) => (
        <button
          key={cat.id}
          className={`category-item ${active === cat.id ? "active" : ""}`}
          onClick={() => onSelect(cat.id)}
        >
          <cat.icon className="category-icon" />
          <span className="category-label">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
