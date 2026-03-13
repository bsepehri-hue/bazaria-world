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
      <header className="topnav">
        <TopNav />
      </header>

      <div className="page-body">
       <aside className="bazaria-sidebar">
          <Sidebar />
        </aside>

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
