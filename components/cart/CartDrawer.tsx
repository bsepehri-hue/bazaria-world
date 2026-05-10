"use client";

import React from "react";
import { FiX, FiTrash2, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../../hooks/useCart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { cart, removeItem, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "400px",
        height: "100vh",
        backgroundColor: "#ffffff",
        boxShadow: "-4px 0 12px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        padding: "24px",
        borderLeft: "1px solid #e5e7eb",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", color: "#111827", fontWeight: "600" }}>Your Cart</h3>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#6b7280" }}
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Cart Items List */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
        {cart.items.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#9ca3af",
              gap: "12px",
            }}
          >
            <FiShoppingBag size={36} />
            <p style={{ margin: 0, fontSize: "14px" }}>Your cart is empty.</p>
          </div>
        ) : (
          cart.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "500", color: "#111827" }}>
                  {item.name}
                </h4>
                <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                  Qty: {item.quantity} × ${item.price.toLocaleString()}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#004d40" }}>
                  ${(item.price * item.quantity).toLocaleString()}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                  title="Remove item"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Total section */}
      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "16px", marginTop: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <span style={{ fontSize: "14px", color: "#374151" }}>Subtotal</span>
          <span style={{ fontSize: "16px", fontWeight: "700", color: "#004d40" }}>
            ${cart.totalAmount.toLocaleString()}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={onCheckout}
            disabled={cart.items.length === 0}
            style={{
              width: "100%",
              backgroundColor: "#004d40",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              padding: "12px 0",
              fontSize: "14px",
              fontWeight: "600",
              cursor: cart.items.length === 0 ? "not-allowed" : "pointer",
              opacity: cart.items.length === 0 ? 0.6 : 1,
            }}
          >
            Proceed to Checkout
          </button>
          <button
            onClick={clearCart}
            style={{
              width: "100%",
              backgroundColor: "#f3f4f6",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              padding: "8px 0",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
