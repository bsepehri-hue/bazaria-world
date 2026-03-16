"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/app/components/ui/TopNav";

export default function AppFrame({ children }) {
  const path = usePathname();

  if (path.startsWith("/auction-link") || path.startsWith("/public")) {
    return <>{children}</>;
  }

 
<div className="page-shell bg-[var(--offwhite-canvas)]">
    <div className="page-body">
      
      {/* LEFT SIDEBAR */}
      <aside className="bazaria-sidebar">
        <Sidebar />
      </aside>

      {/* 1. Added 'min-w-0' to allow horizontal containment 
          2. Added 'flex flex-col' to manage the TopNav and Content stack 
          3. Added 'h-screen' to ensure the TopNav isn't squeezed
      */}
      <div className="page-main flex-1 flex flex-col min-w-0 h-screen bg-[var(--offwhite-canvas)]"> 
        
        <header className="topnav shrink-0">
          <TopNav />
        </header>

        {/* 'overflow-y-auto' ensures only this area scrolls, protecting the TopNav */}
        <main className="page-content flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>

    </div>
  </div>
);
}
