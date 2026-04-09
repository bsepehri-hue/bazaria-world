"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/app/components/ui/TopNav";

export default function AppFrame({ children }) {
  const path = usePathname();
  
  // 🎯 Identify the specific flows
  const isCreateFlow = path.includes("/market/create");
  const isMarketplace = path === "/market" || path.startsWith("/market/category");

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
      /* 🛡️ The floor is Teal for Marketplace, White for Intake */
      backgroundColor: '#f8f8f5' 
    }}>
      
      <header style={{ gridColumn: '1 / -1', borderBottom: '1px solid #ddd', backgroundColor: 'white', zIndex: 50 }}>
        <TopNav />
      </header>

      <aside style={{ 
        gridColumn: '1 / 2', 
        backgroundColor: '#014d4e', /* Sidebar is now officially Teal */
        overflowY: 'auto' 
      }}>
        <Sidebar />
      </aside>

      <main style={{ 
        gridColumn: '2 / -1', 
        overflowY: 'auto', 
        minWidth: 0, 
        /* 🛡️ THE LOGIC: 
           Marketplace gets 24px padding (the white frame).
           Intake Portal gets 0px padding (full bleed white).
        */
        padding: isCreateFlow ? '0px' : '24px', 
        backgroundColor: isCreateFlow ? '#f8f8f5' : 'transparent'
      }}>
        {children}
      </main>

    </div>
  );
}
