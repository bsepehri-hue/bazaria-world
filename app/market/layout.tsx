
"use client";

import { usePathname } from "next/navigation";
import AppFrame from "../../components/layout/AppFrame";

export default function MarketLayout({ children }) {
  const pathname = usePathname();
  const isCreateFlow = pathname.includes("/market/create");

  return (
    <AppFrame>
      {isCreateFlow && (
        <style dangerouslySetInnerHTML={{ __html: `
          /* 1. FORCE THE FOUNDATION */
          /* We target the specific grid cell where the content lives */
          main {
            background-color: #f8f8f5 !important;
            background: #f8f8f5 !important;
            padding: 0 !important;
            position: relative !important;
          }

          /* 2. KILL THE HULK'S GHOST */
          /* This removes any background images or patterns the layout might be using */
          main::before, main::after {
            display: none !important;
          }

          /* 3. THE HOVER LOCK */
          /* We force the hover to be Slate-900 (Nearly Black) so it looks premium, not green */
          .group:hover .group-hover\\:bg-\\[\\#014d4e\\],
          [class*="hover:bg-[#014d4e]"]:hover {
            background-color: #0f172a !important;
            color: white !important;
          }

          /* 4. CONTENT VISIBILITY */
          #create-portal-wrapper {
            position: relative !important;
            z-index: 20 !important;
            background-color: #f8f8f5 !important;
            width: 100% !important;
            min-height: 100vh !important;
          }
        `}} />
      )}

      <div id="create-portal-wrapper" className={isCreateFlow ? "p-8 md:p-16 lg:p-24" : ""}>
        {children}
      </div>
    </AppFrame>
  );
}
