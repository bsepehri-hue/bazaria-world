"use client";

import AppFrame from "../../components/layout/AppFrame";

export default function MarketLayout({ children }) {
  return (
    <AppFrame>
      <CategoryBar />
      {children}
    </AppFrame>
  );
}
