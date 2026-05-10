"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Trash2, ShieldCheck, CreditCard } from "lucide-react";

interface CartItem {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
  ownerId: string;
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Function to load cart data
    const loadCart = () => {
      const stored = localStorage.getItem("bazaria_cart");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && Array.isArray(parsed.items)) {
            setItems(parsed.items);
          } else if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        } catch (e) {
          console.error("Error reading from storage", e);
        }
      }
    };

    loadCart();
    // Listen for custom events triggered when items are added to the cart
    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, []);

  const handleRemoveItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    localStorage.setItem(
      "bazaria_cart",
      JSON.stringify({
        items: updated,
        totalItems: updated.reduce((sum, i) => sum + (i.quantity || 1), 0),
        totalAmount: updated.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0),
      })
    );
    
    // Dispatch a custom event to notify other windows/components
    window.dispatchEvent(new Event("storage"));
  };

  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isMounted) {
    return <div style={{ backgroundColor: "#f8f8f5", minHeight: "100vh" }} />;
  }

  return (
    <div style={{ backgroundColor: "#f8f8f5", minHeight: "100vh", padding: "60px 20px", boxSizing: "border-box" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {/* Back Button */}
        <button
          onClick={() => (window.location.href = "/market")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            color: "#014d4e",
            fontWeight: "900",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            cursor: "pointer",
            marginBottom: "32px",
          }}
        >
          <ArrowLeft size={14} /> Back to Marketplace
        </button>

        {/* Dynamic Summary List */}
        <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "2rem", border: "1px solid #e2e8f0", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "900", color: "#014d4e", marginBottom: "20px" }}>
            Sovereign Ledger Assets ({items.length})
          </h2>

          {items.length === 0 ? (
            <p style={{ fontSize: "10px", color: "#94a3b8", textAlign: "center", padding: "30px 0" }}>
              No assets found in your inventory.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "16px",
                    padding: "16px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "16px",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"}
                    alt={item.title}
                    style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "10px" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: "11px", fontWeight: "900", color: "#014f4e", marginBottom: "4px" }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: "9px", color: "#64748b", textTransform: "uppercase", marginBottom: "8px" }}>
                      {item.category}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", fontWeight: "900", color: "#014d4e" }}>
                        ${item.price.toFixed(2)} USD
                      </span>
                      <span style={{ fontSize: "10px", color: "#64748b" }}>QTY: {item.quantity}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "8px" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {/* Total Invoice */}
              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px", marginTop: "12px", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <span style={{ display: "block", fontSize: "8px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Total Invoice Amount
                  </span>
                  <span style={{ fontSize: "20px", fontWeight: "900", color: "#014d4e" }}>
                    ${totalAmount.toFixed(2)} <span style={{ fontSize: "10px", color: "#94a3b8" }}>USD</span>
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#014d4e" }}>
                  <ShieldCheck size={14} />
                  <span style={{ fontSize: "8px", fontWeight: "900", textTransform: "uppercase" }}>Verified</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Proceed Button */}
        <button
          disabled={items.length === 0}
          onClick={() => alert("Proceeding to off-chain invoice...")}
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
            cursor: items.length === 0 ? "not-allowed" : "pointer",
            opacity: items.length === 0 ? 0.4 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s",
          }}
        >
          <CreditCard size={14} /> Submit Order
        </button>
      </div>
    </div>
  );
}
