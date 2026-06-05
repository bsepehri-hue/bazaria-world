"use client";

import React, { useEffect, useState } from "react";
import { X, ShoppingCart, CreditCard, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext"; // ⚡ Unified global path

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  // ⚡ FIX 1: Extract direct variables from root level of global context hook
  const { items, removeItem, getCartTotal, addItem } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isOpen || !isMounted) return null;

  // ⚡ FIX 2: Safeguard against the root-level array variables directly
  const safeItems = Array.isArray(items) ? items : [];
  const safeTotal = typeof getCartTotal === "function" ? getCartTotal() : 0;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "100%",
        maxWidth: "420px",
        height: "100vh",
        backgroundColor: "#ffffff",
        boxShadow: "-10px 0 25px -5px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        padding: "32px",
        boxSizing: "border-box",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      {/* Drawer Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#014d4e" }}>
          <ShoppingCart size={20} />
          <span style={{ fontSize: "10px", fontWeight: "900", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Sovereign Ledger ({safeItems.reduce((sum, i) => sum + (i.quantity || 1), 0)})
          </span>
        </div>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: "4px" }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Cart Items List */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        {safeItems.length === 0 ? (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "12px", color: "#94a3b8" }}>
            <ShoppingCart size={40} strokeWidth={1} />
            <p style={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              No assets in inventory
            </p>
          </div>
        ) : (
          <div>
            {safeItems.map((item) => {
              // 🧼 Aggressively strip legacy prefixes for pure presentation data
              const pureDisplayId = item.id.toString().replace(/^XID-/i, '').toUpperCase().trim();

              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "16px",
                    padding: "16px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100"}
                    alt={item.title || "Asset Image"}
                    style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "10px" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: "11px", fontWeight: "900", color: "#0f172a", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.title || "Unnamed Asset"}
                    </h4>

                    {/* 🎯 UNIFIED CODES CONTAINER: Premium Visual Tag + Copy Triggers */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }} className="select-none">
                      <div 
                        style={{ backgroundColor: '#FFBF00', color: '#000000', fontSize: '8px', fontWeight: 1000, padding: '2px 6px', borderRadius: '4px' }}
                        className="font-black font-monospace tracking-wider uppercase shadow-xs"
                      >
                        XID CODE
                      </div>
                      <span 
                        title="Click to copy raw code for your records or chat inquiries!"
                        onClick={() => {
                          navigator.clipboard.writeText(pureDisplayId);
                          alert(`Copied Code: ${pureDisplayId}`);
                        }}
                        style={{ fontSize: "10px", color: "#64748b", fontWeight: "700", cursor: "pointer" }}
                        className="font-monospace hover:text-slate-900 transition-colors"
                      >
                        {pureDisplayId} 📋
                      </span>
                    </div>

                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", fontWeight: "900", color: "#014d4e" }}>
                        ${(typeof item.price === "number" ? item.price : 0).toFixed(2)}
                      </span>
                      
                      {/* 🔄 INTERACTIVE STEPPER ENGINE */}
                      <div 
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "8px", 
                          border: "1px solid #e2e8f0", 
                          padding: "3px 8px", 
                          borderRadius: "8px", 
                          backgroundColor: "#ffffff",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                        }}
                        className="select-none"
                      >
                        <button 
  onClick={() => {
    const currentQty = item.quantity || 1;
    removeItem(item.id);
    if (currentQty > 1) {
      addItem({ ...item, quantity: currentQty - 1 });
    }
  }}
  style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "12px", fontWeight: "900", padding: "0 4px" }}
  className="hover:text-rose-600 transition-colors"
>
  −
</button>
                        
                        <span style={{ fontSize: "11px", color: "#0f172a", fontWeight: "900", fontFamily: "monospace", minWidth: "16px", textAlign: "center" }}>
                          {item.quantity || 1}
                        </span>

                        <button 
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation(); // 🛑 Stops double-triggers in layout elements
    const currentQty = item.quantity || 1;
    removeItem(item.id);
    addItem({ ...item, quantity: currentQty + 1 });
  }}
  style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "12px", fontWeight: "900", padding: "0 4px" }}
  className="hover:text-emerald-600 transition-colors"
>
  +
</button>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "8px",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "24px", marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <span style={{ display: "block", fontSize: "8px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Total Invoice Amount
            </span>
            <span style={{ fontSize: "20px", fontWeight: "900", color: "#014d4e" }}>
              ${safeTotal.toFixed(2)} <span style={{ fontSize: "10px", color: "#94a3b8" }}>USD</span>
            </span>
          </div>
        </div>

        <button
          onClick={onCheckout}
          disabled={safeItems.length === 0}
          style={{
            width: "100%",
            backgroundColor: "#014d4e",
            color: "#ffffff",
            padding: "20px",
            borderRadius: "16px",
            border: "none",
            fontSize: "11px",
            fontWeight: "900",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: safeItems.length === 0 ? "not-allowed" : "pointer",
            opacity: safeItems.length === 0 ? 0.4 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s",
          }}
        >
          <CreditCard size={14} /> Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
