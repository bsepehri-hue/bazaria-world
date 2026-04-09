
"use client";

import { usePathname } from "next/navigation";
import AppFrame from "../../components/layout/AppFrame";

export default function MarketLayout({ children }) {
  const pathname = usePathname();
  const isCreateFlow = pathname.includes("/market/create");

  return (
    <AppFrame>
      {/* 🛡️ THE GLOBAL OVERRIDE INJECTION */}
      {isCreateFlow && (
        <style dangerouslySetInnerHTML={{ __html: `
          /* 1. Neutralize the Global Variable */
          :root {
            --teal-primary: #f8f8f5 !important;
            --offwhite-canvas: #f8f8f5 !important;
          }

          /* 2. Target the Sidebar-Main Gap & Background */
          main {
            background-color: #f8f8f5 !important;
            background: #f8f8f5 !important;
            padding: 0 !important; /* Forces the white to touch the sidebar/nav */
          }

          /* 3. Target any static teal containers */
          [style*="background-color: #004d40"], 
          [style*="background-color: #014d4e"],
          .bg-teal-900, 
          .bg-[#014d4e] {
            background-color: #f8f8f5 !important;
          }

          /* 4. THE GHOST-KILLER: Neutralize hover/group-hover states */
          /* This stops the "Green Flicker" when hovering over cards/buttons */
          [class*="hover:bg-[#014d4e]"]:hover,
          [class*="group-hover:bg-[#014d4e]"]:hover,
          .group:hover [class*="group-hover:bg-[#014d4e]"],
          button:hover {
            background-color: #0f172a !important; /* Premium Dark Navy instead of Green */
            color: white !important;
          }

          /* 5. Force specific text colors to stay dark on the new white background */
          h1, h2, p {
            color: inherit;
          }

          /* 6. Ensure the Content is visible and layered correctly */
          #create-portal-wrapper {
            position: relative;
            z-index: 10;
            background-color: #f8f8f5 !important;
            min-height: 100vh;
          }
        `}} />
      )}

      <div id="create-portal-wrapper" className={isCreateFlow ? "p-8 md:p-16 lg:p-20" : ""}>
        {children}
      </div>
    </AppFrame>
  );
}
