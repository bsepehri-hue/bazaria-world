"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/app/components/ui/TopNav";
import CategoryBar from "@/components/marketplace/CategoryBar";

export default function AppFrame({ children }) {
  const path = usePathname();

  // 🎯 Identify the Intake Flow
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
      /* 🛡️ DYNAMIC FOUNDATION: 
         If creating, use off-white. If in Marketplace/Vault, use the Teal.
      */
      backgroundColor: isCreateFlow ? '#f8f8f5' : '#014d4e' 
    }}>
      
      {/* 1. TOPNAV */}
      <header style={{ gridColumn: '1 / -1', borderBottom: '1px solid #ddd', backgroundColor: 'white', zIndex: 50 }}>
        <TopNav />
      </header>

      {/* 2. SIDEBAR */}
      <aside style={{ gridColumn: '1 / 2', backgroundColor: '#004d40', overflowY: 'auto' }}>
        <Sidebar />
      </aside>

      {/* 3. MAIN CONTENT */}
      <main style={{ 
        gridColumn: '2 / -1', 
        overflowY: 'auto', 
        minWidth: 0, 
        /* 🛡️ THE PADDING TOGGLE: 
           '0px' for the clean Intake look. '24px' for the standard Marketplace look.
        */
        padding: isCreateFlow ? '0px' : '24px', 
        backgroundColor: isCreateFlow ? '#f8f8f5' : 'transparent'
      }}>
        {children}
      </main>

    </div>
  );
}
