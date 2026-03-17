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
  <div style={{ 
    display: 'grid', 
    gridTemplateRows: '64px 1fr', /* Row 1: 64px tall (Nav). Row 2: remaining space (Body) */
    gridTemplateColumns: '240px 1fr', /* Col 1: 240px wide (Sidebar). Col 2: remaining space (Content) */
    height: '100vh', 
    width: '100vw', 
    overflow: 'hidden',
    backgroundColor: '#fcfcfc'
  }}>
    
    {/* 1. TOPNAV: Spans from the first column line to the very end (-1) */}
    <header style={{ gridColumn: '1 / -1', borderBottom: '1px solid #ddd', backgroundColor: 'white', zIndex: 50 }}>
      <TopNav />
    </header>

    {/* 2. SIDEBAR: Sits in Column 1, Row 2 */}
    <aside style={{ gridColumn: '1 / 2', backgroundColor: '#004d40', overflowY: 'auto' }}>
      <Sidebar />
    </aside>

    {/* 3. MAIN CONTENT: Sits in Column 2, Row 2 */}
    <main style={{ gridColumn: '2 / -1', overflowY: 'auto', minWidth: 0, padding: '24px' }}>
      {children}
    </main>

  </div>
);
}
