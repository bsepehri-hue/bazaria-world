"use client";

import AppFrame from "../../components/layout/AppFrame";
import CategoryBar from "@/components/marketplace/CategoryBar";

export default function MarketLayout({ children }) {
  return (
    <AppFrame>
      <CategoryBar />
      {children}
    </AppFrame>
  );
}
