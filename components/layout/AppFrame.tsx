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
    {/* HEADER occupies the full top strip */}
    <header className="topnav-container">
      <TopNav />
    </header>

    {/* BODY handles the left-to-right split */}
    <div className="page-body">
      <aside className="bazaria-sidebar">
        <Sidebar />
      </aside>

      <main className="page-main">
        {children}
      </main>
    </div>
  </div>
);
}
