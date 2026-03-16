"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/app/components/ui/TopNav";
import CategoryBar from "@/components/marketplace/CategoryBar";

export default function AppFrame({ children }) {
  const path = usePathname();

  if (path.startsWith("/auction-link") || path.startsWith("/public")) {
    return <>{children}</>;
  }

  return (
    <div className="page-shell bg-[var(--offwhite-canvas)] h-screen overflow-hidden">
      <div className="page-body flex h-full">
        
        <aside className="bazaria-sidebar shrink-0">
          <Sidebar />
        </aside>

        <div className="page-main flex-1 flex flex-col min-w-0 bg-[var(--offwhite-canvas)]">

          {/* TOP NAV */}
          <header className="topnav shrink-0">
            <TopNav />
          </header>

          {/* CATEGORY BAR — FIXED POSITION UNDER TOPNAV */}
          <div className="shrink-0">
            <CategoryBar />
          </div>

          {/* SCROLLABLE CONTENT */}
          <main className="page-content flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </main>

        </div>

      </div>
    </div>
  );
}
