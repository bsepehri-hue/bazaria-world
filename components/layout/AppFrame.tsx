"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/app/components/ui/TopNav";
import AIConciergeDrawer from "@/components/ui/AIConciergeDrawer";
import ClientSupportChat from "@/components/ui/ClientSupportChat"; 

const SidebarContext = createContext<{
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within an AppFrame");
  }
  return context;
};

export function SidebarToggleButton() {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const path = usePathname();

  // Hide button on onboarding, public storefronts, or the root/dashboard landing page
  if (
    path.includes("/market/create/onboarding") || 
    path.startsWith("/storefront") || 
    path === "/" || 
    path === "/dashboard"
  ) return null;

  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        setIsSidebarOpen(!isSidebarOpen);
      }}
      style={{ 
        background: "#f1f5f9", 
        border: "1px solid #e5e7eb", 
        borderRadius: "10px", 
        padding: "10px", 
        cursor: "pointer",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        marginRight: "16px",
        transition: "background 0.2s"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e2e8f0")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
      title="Toggle Menu Sidebar"
    >
      {isSidebarOpen ? <FiX size={16} color="#05292e" /> : <FiMenu size={16} color="#05292e" />}
    </button>
  );
}

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 🎯 DETECT LANDING SPLASH PAGE:
  const isLandingPage = path === "/" || path === "/dashboard";

  const isPublicStorefront = path.includes("storefront") || path.includes("modern-art");
  const isOnboarding = path.includes("/market/create/onboarding");
  
  const coreAppRoutes = [
    "/market", 
    "/dashboard", 
    "/profile", 
    "/settings", 
    "/storefronts", 
    "/wallet"
  ];

  const isRouteCore = coreAppRoutes.some(route => path.startsWith(route)) && !isPublicStorefront;
  const isRouteBypass = path.startsWith("/auction-link") || path.startsWith("/public");

  useEffect(() => {
    if (isOnboarding || isPublicStorefront || isLandingPage) {
      setIsSidebarOpen(false);
      return;
    }

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    const hintTimeout = setTimeout(() => {
      handleResize();
    }, 800);

    window.addEventListener("resize", handleResize);
    
    return () => {
      clearTimeout(hintTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [path, isOnboarding, isPublicStorefront, isLandingPage, setIsSidebarOpen]);

  useEffect(() => {
    const handleOpenConcierge = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log("AppFrame: Intercepted support trigger. Opening AI Concierge in mode:", customEvent.detail?.mode);
      
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("open-ai-concierge", handleOpenConcierge);
    return () => window.removeEventListener("open-ai-concierge", handleOpenConcierge);
  }, []);

  // 🎯 SHORT-CIRCUIT LAYOUT IF LANDING PAGE: 
  // Renders children seamlessly without TopNav headers, sidebars, or white background layers.
  if (isLandingPage) {
    return (
      <SidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
        <div style={{ width: "100vw", minHeight: "100vh", overflowX: "hidden" }}>
          {children}
        </div>
        <AIConciergeDrawer />
      </SidebarContext.Provider>
    );
  }

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      <div style={{ 
        display: "flex", 
        height: "100vh", 
        width: "100vw", 
        overflow: "hidden",
        backgroundColor: "#ffffff",
        margin: 0,
        padding: 0
      }}>
        {/* Sidebar Column */}
        <div style={{
          width: isSidebarOpen ? "240px" : "0px",
          minWidth: isSidebarOpen ? "240px" : "0px",
          maxWidth: isSidebarOpen ? "240px" : "0px",
          height: "100%",
          flexShrink: 0,
          overflow: "hidden",
          position: "relative",
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}>
          <div 
            className="bazaria-sidebar no-scrollbar"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "240px",
              height: "100%",
              backgroundColor: "#05292e",
              overflowY: "auto",
              boxSizing: "border-box"
            }}
          >
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>

        {/* Main Content Column */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#ffffff"
        }}>
          {/* Header/TopBar */}
          <div style={{ 
            height: "64px",
            minHeight: "64px",
            maxHeight: "64px",
            borderBottom: "1px solid #e5e7eb", 
            backgroundColor: "#ffffff", 
            zIndex: 99,
            flexShrink: 0,
            width: "100%",
            display: "flex",
            alignItems: "center",
            paddingLeft: "16px"
          }}>
            <SidebarToggleButton />
            <div style={{ width: "100%", paddingRight: "16px" }}>
              <TopNav />
            </div>
          </div>

          {/* Content Area */}
          <div style={{ 
            flex: 1, 
            overflowY: "auto", 
            padding: path.includes("/market/create") ? "0px" : "24px", 
            width: "100%",
            boxSizing: "border-box"
          }}>
            {children}
          </div>
        </div>
      </div>

      <AIConciergeDrawer />
      {/* <ClientSupportChat /> */}

    </SidebarContext.Provider>
  );
}
