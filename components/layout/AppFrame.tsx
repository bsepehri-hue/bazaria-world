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
  <div className="page-shell">
    {/* This container wraps your TopNav component */}
    <header className="topnav-container">
      <TopNav />
    </header>

    <div className="page-body">
      {/* Sidebar on the left */}
      <aside className="bazaria-sidebar">
        <Sidebar />
      </aside>

      {/* Main content on the right */}
      <main className="page-main">
        {children}
      </main>
    </div>
  </div>
);
}
