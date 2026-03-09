"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SidebarItem } from "@/components/ui/SidebarItem";

interface SidebarProps {
  userId: string;
  sidebarOpen: boolean;
}

export default function Sidebar({ userId, sidebarOpen }: SidebarProps) {
  return (
    <aside
      className={`bg-white border-r border-gray-200 h-screen p-4 flex flex-col transition-all duration-300 ${
        sidebarOpen ? "w-[220px]" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard">
          <Image
            src="/logo.png"
            alt="Logo"
            width={sidebarOpen ? 120 : 40}
            height={40}
          />
        </Link>
      </div>

      {/* Sidebar Items */}
      <nav className="mt-6">
        <ul className="space-y-1 mt-4">
          {/* No dynamic items for now */}
        </ul>
      </nav>
    </aside>
  );
}
