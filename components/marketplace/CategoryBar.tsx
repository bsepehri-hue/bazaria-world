"use client";

import { useState } from "react";
import { MARKET_CATEGORIES } from "@/lib/categories";

export default function CategoryBar({ active, onSelect }) {

  // ✅ Correct location for state
  const [openCategory, setOpenCategory] = useState(null);
  const [activeSub, setActiveSub] = useState(null);

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

    {MARKET_CATEGORIES.map((cat) => (
  <div key={cat.id} className="category-item-wrapper">
    <button
      className={`category-item ${active === cat.id ? "active" : ""}`}
      onClick={() =>
        setOpenCategory(openCategory === cat.id ? null : cat.id)
      }
    >
      <cat.icon
        className="category-icon w-5 h-5 flex-shrink-0"
        weight="regular"
      />
      <span className="category-label">{cat.label}</span>
    </button>

    {openCategory === cat.id && (
      <div className="subcategory-panel">
        {cat.subcategories.map((sub) => (
          <button
            key={sub.id}
            className="subcategory-item"
            onClick={() => onSelectSub(sub.id)}
          >
            {sub.label}
          </button>
        ))}
      </div>
    )}
  </div>
))}
