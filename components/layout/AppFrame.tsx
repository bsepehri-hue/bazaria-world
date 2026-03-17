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
  <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
    
    {/* 1. TOPNAV: Always at the very top */}
    <header style={{ height: '64px', width: '100%', borderBottom: '1px solid #ddd', background: 'white', flexShrink: 0, zIndex: 10 }}>
      <TopNav />
    </header>

    {/* 2. BODY: Holds Sidebar and Content side-by-side */}
    <div style={{ display: 'flex', flex: 1, minHeight: 0, width: '100%' }}>
      
      {/* 3. SIDEBAR: Locked to the left */}
      <aside style={{ width: '240px', background: '#004d40', flexShrink: 0, height: '100%', overflowY: 'auto' }}>
        <SidebarMenu menu={menu} />
      </aside>

      {/* 4. MAIN CONTENT: The scrollable area for Marketplace */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#fcfcfc' }}>
        {children}
      </main>

    </div>
  </div>
);
}
