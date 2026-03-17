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
  <div className="flex flex-col h-screen w-full overflow-hidden">
    {/* TOPNAV AREA */}
    <header className="h-16 border-b border-gray-200 bg-white shrink-0">
      <TopNav />
    </header>

    {/* MAIN BODY AREA */}
    <div className="flex flex-1 min-h-0">
      {/* SIDEBAR stays fixed to the left */}
      <aside className="w-60 bg-[#004d40] text-white shrink-0 overflow-y-auto">
        <Sidebar />
      </aside>

      {/* CONTENT scrolls independently */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  </div>
);
}
