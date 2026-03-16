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
    // 'h-screen' and 'overflow-hidden' on the shell prevents the whole page from bouncing
    <div className="page-shell bg-[var(--offwhite-canvas)] h-screen overflow-hidden">
      
      {/* 1. page-body must be 'flex' so it can divide space between Sidebar and Main */}
      <div className="page-body flex h-full">
        
        {/* LEFT SIDEBAR */}
        <aside className="bazaria-sidebar shrink-0">
          <Sidebar />
        </aside>

        {/* 2. page-main: 'min-w-0' is the secret ingredient for the category scroll */}
        <div className="page-main flex-1 flex flex-col min-w-0 bg-[var(--offwhite-canvas)]"> 
          
          <header className="topnav shrink-0">
            <TopNav />
          </header>

          {/* 3. page-content: the actual scrollable area for Marketplace */}
          <main className="page-content flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}
