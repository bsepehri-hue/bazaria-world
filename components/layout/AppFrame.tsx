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
    <header className="topnav-container">
      <TopNav />
    </header>

    <div className="page-body">
      <aside className="sidebar-container">
        {/* Use your specific Sidebar component here */}
        <Sidebar /> 
      </aside>

      <main className="main-container">
        {children}
      </main>
    </div>
  </div>
);
}
