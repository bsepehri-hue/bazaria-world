"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext"; // ⚡ New unified global path
import { CartDrawer } from "@/components/checkout/CartDrawer";
import { ShoppingCart } from "lucide-react";
// 🛎️ Import your new AI Concierge!
import AIConciergeDrawer from "@/components/ui/AIConciergeDrawer"; 

export function DynamicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
 const pathname = usePathname();
  
  // ⚡ 1. Pull the direct properties straight out of your global context engine
  const { items } = useCart(); 

  // ⚡ 2. Calculate the exact item quantities currently committed to the cart state
  const totalItemsCount = Array.isArray(items) 
    ? items.reduce((sum, i) => sum + (i.quantity || 1), 0) 
    : 0;

  // Verify whether the user is on the onboarding page
  const isOnboarding = pathname === "/market/create/onboarding";
  
  // 📍 Check if user is inside the inbox so we can clear the layout conflict
  const isInboxPage = pathname === "/market/inbox";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <>
      {/* 🛒 Global Cart Trigger */}
      {!isOnboarding && (
        <button
          onClick={() => setIsCartOpen(true)}
          style={{
            position: "fixed",
            bottom: isInboxPage ? "110px" : "32px",
            right: "32px",
            zIndex: 99,
            backgroundColor: "#014d4e",
            color: "#ffffff",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "none",
            boxShadow: "0 10px 25px -5px rgba(1, 77, 78, 0.4)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease-in-out",
          }}
          className="hover:scale-105"
        >
          <ShoppingCart size={20} />
          
          {/* ⚡ 3. DYNAMIC BADGE OVERLAY: Uses your unified global context count */}
          {totalItemsCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                backgroundColor: "#ffffff",
                color: "#014d4e",
                fontSize: "9px",
                fontWeight: "900",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #014d4e",
              }}
            >
              {totalItemsCount}
            </span>
          )}
        </button>
      )}

      {/* Slide-out Cart Panel Component */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          window.location.href = "/market/checkout";
        }}
      />

      {/* 🛎️ ELEGANTLY DOCKED FLOATING AI CONCIERGE */}
      {/* (Hides on onboarding just like the cart to keep focus clean) */}
      {/* 🛑 DUPLICATE REMOVED: Managed globally by AppFrame now to prevent double-stack ghosts */}

      {children}
    </>
  );
}
