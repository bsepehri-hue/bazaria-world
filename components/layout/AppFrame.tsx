"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/app/components/ui/TopNav";

export default function AppFrame({ children }) {
  const path = usePathname();
  const isCreateFlow = path.includes("/market/create");

  if (path.startsWith("/auction-link") || path.startsWith("/public")) {
    return <>{children}</>;
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateRows: '64px 1fr', 
      gridTemplateColumns: '240px 1fr', 
      height: '100vh', 
      width: '100vw', 
      overflow: 'hidden',
      backgroundColor: isCreateFlow ? '#f8f8f5' : '#014d4e' 
    }}>
      
      {/* 1. TOPNAV */}
      <header style={{ gridColumn: '1 / -1', borderBottom: '1px solid #ddd', backgroundColor: 'white', zIndex: 50 }}>
        <TopNav />
      </header>

      {/* 2. SIDEBAR - UPDATED TO OFFICIAL BAZARIA TEAL */}
      <aside style={{ 
        gridColumn: '1 / 2', 
        backgroundColor: '#014d4e', /* 🎯 THE CORRECT TEAL */
        overflowY: 'auto',
        borderRight: isCreateFlow ? '1px solid rgba(0,0,0,0.05)' : 'none' 
      }}>
        <Sidebar />
      </aside>

      {/* 3. MAIN CONTENT */}
      <main style={{ 
        gridColumn: '2 / -1', 
        overflowY: 'auto', 
        minWidth: 0, 
        /* Kill the 24px gap for the Intake portal */
        padding: isCreateFlow ? '0px' : '24px', 
        backgroundColor: isCreateFlow ? '#f8f8f5' : 'transparent',
      }}>
        {children}
      </main>

    </div>
  );
}
