"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/app/components/ui/TopNav";

export default function AppFrame({ children }) {
  const path = usePathname();

  if (path.startsWith("/auction-link") || path.startsWith("/public")) {
    return <>{children}</>;
  }

  return (
    <div className="page-shell bg-[var(--offwhite-canvas)] h-screen overflow-hidden">
      <div className="page-body flex h-full min-h-0">

        {/* SIDEBAR */}
        <aside className="bazaria-sidebar shrink-0">
          <Sidebar />
        </aside>

        {/* MAIN COLUMN — this wrapper was missing */}
        <div className="page-main flex-1 flex flex-col min-w-0 min-h-0 bg-[var(--offwhite-canvas)]">

          {/* TOPNAV */}
          <header className="topnav shrink-0 overflow-x-auto whitespace-nowrap">
            <TopNav />
          </header>

          {/* PAGE CONTENT */}
          <main className="page-content flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden">
            {children}
          </main>

        </div>

      </div>
    </div>
  );
}
