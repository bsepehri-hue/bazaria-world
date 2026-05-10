"use client";

import Link from "next/link";

const CATEGORIES = [
  "art",
  "cars",
  "general",
  "homes",
  "land",
  "motorcycles",
  "pets",
  "rentals",
  "rooms",
  "rv",
  "services",
  "timeshare",
  "trucks"
];

export default function CategoryButtons() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {CATEGORIES.map((cat) => (
        <Link
          key={cat}
          href={`/market/${cat}`}
          style={{
            padding: "10px 15px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            textDecoration: "none",
            color: "#333",
            background: "#f9f9f9"
          }}
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </Link>
      ))}
    </div>
  );
}
