TypeScript
"use client";

import { usePathname } from "next/navigation";
import AppFrame from "../../components/layout/AppFrame";

export default function MarketLayout({ children }) {
  const pathname = usePathname();
  const isCreateFlow = pathname.includes("/market/create");

  return (
    <AppFrame>
      {/* 🛡️ THE NEUTRALIZER
        If we are in the create flow, we force a container that 
        fills the entire AppFrame 'main' area with off-white, 
        leaving no room for green to leak through.
      */}
      <div 
        className={isCreateFlow ? "w-full min-h-full bg-[#f8f8f5]" : ""}
        style={isCreateFlow ? { 
          backgroundColor: '#f8f8f5',
          margin: '-24px', // 👈 This 'swallows' the 24px padding from AppFrame
          padding: '24px', // 👈 This puts the padding back INSIDE our white zone
          minHeight: 'calc(100vh - 64px)' 
        } : {}}
      >
        {children}
      </div>
    </AppFrame>
  );
}
