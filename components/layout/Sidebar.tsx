// components/layout/Sidebar.tsx

"use client";

import Link from "next/link";
import { sidebarItems } from "./sidebarItems";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-menu">
        {sidebarItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="sidebar-item"
          >
            <item.icon className="sidebar-icon" />
            <span className="sidebar-label">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
