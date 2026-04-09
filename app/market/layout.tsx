
"use client";

import { usePathname } from "next/navigation";
import AppFrame from "../../components/layout/AppFrame";

export default function MarketLayout({ children }) {
  const pathname = usePathname();
  const isCreateFlow = pathname.includes("/market/create");

  return (
    <AppFrame>
      {/* 🛡️ THE VISIBILITY LOCK */}
      {isCreateFlow && (
        <style dangerouslySetInnerHTML={{ __html: `
          /* 1. Push all parent backgrounds to the absolute bottom */
          body, main, .page-shell, .page-body {
            background-color: #f8f8f5 !important;
            z-index: 0 !important;
          }

          /* 2. Kill the padding gap */
          main {
            padding: 0 !important;
          }

          /* 3. Pull the content container to the absolute top */
          #create-portal-wrapper {
            position: relative !important;
            z-index: 9999 !important; /* Forces it above the white 'paint' */
            background-color: transparent !important; /* Let the body color show through */
            min-height: 100vh;
            display: block !important;
            visibility: visible !important;
          }

          /* 4. Ensure the actual cards/buttons are visible */
          #create-portal-wrapper button, 
          #create-portal-wrapper div {
             visibility: visible !important;
             opacity: 1 !important;
          }

          /* 5. The Ghost-Killer (Hover state) */
          [class*="group-hover:bg-[#014d4e]"]:hover,
          .group:hover [class*="group-hover:bg-[#014d4e]"] {
            background-color: #0f172a !important; 
            color: white !important;
          }
        `}} />
      )}

      {/* 🏗️ This ID is now the "Anchor" that pulls your cards to the front */}
      <div id="create-portal-wrapper" className={isCreateFlow ? "p-8 md:p-16 lg:p-20" : ""}>
        {children}
      </div>
    </AppFrame>
  );
}
