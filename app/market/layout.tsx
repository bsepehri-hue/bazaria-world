
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

          /* 2. Target the Sidebar-Main Gap (The Hulk's hiding spot) */
          main {
            background-color: #f8f8f5 !important;
            background: #f8f8f5 !important;
            padding: 0 !important; /* Force delete that 24px gap */
          }

          /* 3. Target any hardcoded teal containers in the parent */
          [style*="background-color: #004d40"], 
          [style*="background-color: #014d4e"],
          .bg-teal-900, 
          .bg-[#014d4e] {
            background-color: #f8f8f5 !important;
          }

          /* 4. Ensure the Content is visible */
          #create-portal-wrapper {
            position: relative;
            z-index: 10;
            background-color: #f8f8f5;
            min-height: 100vh;
          }
        `}} />
      )}

      <div id="create-portal-wrapper" className={isCreateFlow ? "p-8 md:p-16" : ""}>
        {children}
      </div>
    </AppFrame>
  );
}
