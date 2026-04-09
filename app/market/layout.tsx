"use client";

import { usePathname } from "next/navigation";
import AppFrame from "../../components/layout/AppFrame";

export default function MarketLayout({ children }) {
  const pathname = usePathname();
  
  // 🎯 Identify if we are in the "Intake" flow
  const isCreateFlow = pathname.includes("/market/create");

  return (
    /* We wrap the children in a div that forces the background to off-white
       AND we pass a prop to AppFrame (if it supports it) or override its 
       internal container styles.
    */
    <div className={isCreateFlow ? "bg-[#f8f8f5] min-h-screen" : ""}>
      <AppFrame isCreateFlow={isCreateFlow}>
        {/* If AppFrame has an internal 'main' tag with padding, 
           we wrap the children here to neutralize it.
        */}
        <div className={isCreateFlow ? "bg-[#f8f8f5] h-full w-full" : ""}>
          {children}
        </div>
      </AppFrame>
    </div>
  );
}
