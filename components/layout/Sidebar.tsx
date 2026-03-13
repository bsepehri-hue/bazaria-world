"use client";

import Link from "next/link";
import { sidebarItems } from "./sidebarItems";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      {/* SIDEBAR LOGO */}
      <div className="flex flex-col items-center mt-4 mb-6">
        <span className="text-white tracking-wide font-semibold text-lg">
          BAZARIA
        </span>
        <div className="w-12 h-[2px] bg-amber-400 mt-1 rounded-full opacity-90"></div>
      </div>

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
