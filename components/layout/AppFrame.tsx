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
    <div className="page-shell">
      <div className="page-body">
        
        {/* LEFT SIDEBAR */}
        <aside className="bazaria-sidebar">
          <Sidebar />
        </aside>

        {/* MAIN AREA: TopNav + Content share the SAME left origin */}
        <div className="page-main">
          <header className="topnav">
            <TopNav />
          </header>

          <main className="page-content">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}
