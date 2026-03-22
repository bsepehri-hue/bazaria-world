"use client";

import Link from "next/link";
import { sidebarItems } from "./sidebarItems";

export default function Sidebar() {
  return (
  <aside className="bazaria-sidebar">

  {/* --- SIDEBAR LOGO: REFINED BRANDING --- */}
  <div className="flex flex-col items-start px-8 mt-10 mb-10"> 
    {/* items-start aligns it to the left side of the sidebar padding */}
    <span className="text-white tracking-[0.1em] font-black text-[24px] leading-none">
      BAZARIA
    </span>
    
    {/* The Amber Twist: A sharp, solid line that accents the brand */}
    <div className="w-16 h-[3px] bg-[#FFBF00] mt-2 shadow-[0_0_10px_rgba(255,191,0,0.3)]"></div>
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
