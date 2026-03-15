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
    // Add the offwhite background here to catch any "zoom out" gaps
    <div className="page-shell bg-[var(--offwhite-canvas)]">
      <div className="page-body !mt-0"> {/* Override the margin-top if it's causing a gap */}
        
        {/* LEFT SIDEBAR */}
        <aside className="bazaria-sidebar">
          <Sidebar />
        </aside>

        {/* MAIN AREA */}
        <div className="page-main flex flex-col h-screen">
          <header className="topnav border-b bg-white">
            <TopNav />
          </header>

          {/* page-content should handle its own scrolling and background */}
          <main className="page-content bg-[var(--offwhite-canvas)] flex-1 overflow-y-auto">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}
