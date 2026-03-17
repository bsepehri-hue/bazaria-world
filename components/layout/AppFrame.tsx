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
  <div style={{ background: 'red', height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <h1 style={{ fontSize: '5rem', color: 'white' }}>IS THIS UPDATING?</h1>
  </div>
);
}
