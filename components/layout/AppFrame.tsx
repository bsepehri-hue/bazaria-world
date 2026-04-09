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
    <>
      {/* 🛡️ THE GLOBAL "HULK-KILLER" */}
      {isCreateFlow && (
        <style dangerouslySetInnerHTML={{ __html: `
          /* Force the root and body to be white */
          html, body, #__next, .app-root {
            background-color: #f8f8f5 !important;
            background: #f8f8f5 !important;
          }

          /* Force the AppFrame container to fill and be white */
          .app-frame-root {
            background-color: #f8f8f5 !important;
          }

          /* Neutralize any parent padding that might be leaking green */
          main {
            padding: 0 !important;
            background-color: #f8f8f5 !important;
          }
        `}} />
      )}

      <div 
        className="app-frame-root"
        style={{ 
          display: 'grid', 
          gridTemplateRows: '64px 1fr', 
          gridTemplateColumns: '240px 1fr', 
          height: '100vh', 
          width: '100vw', 
          overflow: 'hidden',
          backgroundColor: isCreateFlow ? '#f8f8f5' : '#014d4e' 
        }}
      >
        <header style={{ gridColumn: '1 / -1', borderBottom: '1px solid #ddd', backgroundColor: 'white', zIndex: 50 }}>
          <TopNav />
        </header>

        <aside style={{ gridColumn: '1 / 2', backgroundColor: '#004d40', overflowY: 'auto' }}>
          <Sidebar />
        </aside>

        <main style={{ 
          gridColumn: '2 / -1', 
          overflowY: 'auto', 
          minWidth: 0, 
          padding: isCreateFlow ? '0px' : '24px', 
          backgroundColor: isCreateFlow ? '#f8f8f5' : 'transparent'
        }}>
          {children}
        </main>
      </div>
    </>
  );
}
