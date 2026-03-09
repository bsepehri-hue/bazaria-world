"use client";

import AppFrame from "@/components/layout/AppFrame";
import CategoryMenu from "@/components/navigation/CategoryMenu";

export default function MarketplaceLayout({ children }) {
  return (
    <AppFrame>
      <CategoryMenu />
      <div className="pt-[56px]">
        {children}
      </div>
    </AppFrame>
  );
}
