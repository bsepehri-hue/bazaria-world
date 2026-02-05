"use client";

import { motion } from "framer-motion";

interface SidebarTooltipProps {
  label: string;
  show: boolean;
}

export default function SidebarTooltip({ label, show }: SidebarTooltipProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -4 }}
      transition={{ duration: 0.15 }}
      className="
        absolute left-full top-1/2 -translate-y-1/2 ml-3
        whitespace-nowrap px-3 py-1.5 rounded-md text-sm
        bg-gray-900 text-white shadow-lg z-[9999]
      "
    >
      {label}
    </motion.div>
  );
}
