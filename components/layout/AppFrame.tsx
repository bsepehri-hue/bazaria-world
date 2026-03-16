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
    <div className="page-shell bg-[var(--offwhite-canvas)] flex flex-col h-screen">
      <header className="topnav shrink-0">
        <TopNav />
      </header>
      
      <div className="page-body flex flex-1 min-h-0 overflow-hidden">
        <aside className="sidebar shrink-0">
          <SidebarMenu menu={menu} />
        </aside>

        {/* This wrapper is the secret to fixing the 110% zoom spill */}
        <main className="page-content flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-[var(--offwhite-canvas)]">
          {children}
        </main>
      </div>
    </div>
  );
}
