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
  <div className="page-shell bg-[var(--offwhite-canvas)]"> {/* Added background here */}
    <div className="page-body">
      
      <aside className="bazaria-sidebar">
        <Sidebar />
      </aside>

      {/* Adding 'flex-1' ensures this container takes up all remaining width */}
      <div className="page-main flex-1 bg-[var(--offwhite-canvas)]"> 
        <header className="topnav">
          <TopNav />
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>

    </div>
  </div>
);
