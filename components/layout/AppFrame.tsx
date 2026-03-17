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
      
      {/* HEADER: Forced to stay at the top */}
      <header style={{ height: '64px', width: '100%', borderBottom: '1px solid #ddd', background: 'white', flexShrink: 0 }}>
        <TopNav />
      </header>

      <div style={{ display: 'flex', flex: 1, minHeight: 0, width: '100%' }}>
        
        {/* SIDEBAR: Forced to stay on the left */}
        <aside style={{ width: '240px', background: '#004d40', flexShrink: 0, height: '100%', overflowY: 'auto' }}>
          <Sidebar />
        </aside>

        {/* MAIN CONTENT: Forced to scroll independently */}
        <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#f9fafb' }}>
          {children}
        </main>

      </div>
    </div>
  );
}
