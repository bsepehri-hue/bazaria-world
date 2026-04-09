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
      /* 🛡️ FORCE THE BACKGROUND HERE TO OFF-WHITE */
      backgroundColor: '#f8f8f5' 
    }}>
      
      {/* 1. TOPNAV */}
      <header style={{ gridColumn: '1 / -1', borderBottom: '1px solid #ddd', backgroundColor: 'white', zIndex: 50 }}>
        <TopNav />
      </header>

      {/* 2. SIDEBAR */}
      <aside style={{ gridColumn: '1 / 2', backgroundColor: '#004d40', overflowY: 'auto' }}>
        <Sidebar />
      </aside>

      {/* 3. MAIN CONTENT: THE KILL SHOT */}
      <main style={{ 
        gridColumn: '2 / -1', 
        overflowY: 'auto', 
        minWidth: 0, 
        /* 🛡️ IF WE ARE IN CREATE FLOW, REMOVE PADDING (KILLS THE GREEN FRAME) 
           AND FORCE THE BACKGROUND TO OFF-WHITE
        */
        padding: isCreateFlow ? '0px' : '24px', 
        backgroundColor: '#f8f8f5'
      }}>
        {children}
      </main>

    </div>
  );
}
