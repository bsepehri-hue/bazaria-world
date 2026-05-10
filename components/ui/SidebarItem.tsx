"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { motion } from "framer-motion";
import SidebarTooltip from "@/components/ui/SidebarTooltip";

interface SidebarItemProps {
  name: string;
  href?: string;
  Icon?: LucideIcon | React.ElementType;
  state?: 'grey' | 'teal' | 'emerald' | 'amber' | 'burgundy';
  count?: number;
  collapsed?: boolean;
}

const ACTIVE_TEAL = '#00d164';

const colorMap: Record<string, string> = {
  grey: 'text-gray-400',
  teal: 'text-teal-400',
  emerald: 'text-green-500',
  amber: 'text-yellow-400',
  burgundy: 'text-red-600'
};

export const SidebarItem: React.FC<SidebarItemProps> = ({
  name,
  href,
  Icon,
  state,
  count,
  collapsed
}) => {
  const pathname = usePathname();
  const isActive = href ? pathname === href : false;
  const [hovered, setHovered] = useState(false);

  // ⭐ Badge ladder items (no href)
  if (!href) {
    return (
      <li
        className={`relative flex items-center space-x-3 py-2 px-4 rounded-lg ${colorMap[state || 'grey']}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {Icon ? <Icon className="w-5 h-5" /> : <span>•</span>}
        {!collapsed && <span className="font-medium">{name}</span>}

        {collapsed && (
          <SidebarTooltip label={name} show={hovered} />
        )}
      </li>
    );
  }

  // ⭐ Navigation items
  return (
    <li
      className="relative w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Sliding highlight */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-lg"
          style={{ backgroundColor: ACTIVE_TEAL }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Tooltip (collapsed only) */}
      {collapsed && (
        <SidebarTooltip label={name} show={hovered} />
      )}

      <Link
        href={href}
        className={`
          relative flex items-center justify-between w-full py-3 px-4 rounded-lg transition-all duration-150
          ${isActive ? 'text-white font-bold' : 'text-gray-300 hover:text-white'}
        `}
      >
        {/* Left side */}
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="w-5 h-5" />}

          {!collapsed && (
            <span className={`${isActive ? "font-bold" : "font-medium"}`}>
              {name}
            </span>
          )}
        </div>

        {/* Numeric badge */}
        {!collapsed && typeof count === "number" && count > 0 && (
          <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </Link>
    </li>
  );
};