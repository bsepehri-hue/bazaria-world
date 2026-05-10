"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShieldCheck } from "lucide-react";

export function CheckoutEngine() {
  const { items, getCartTotal, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setProcessing(true);

    try {
      // Amount in cents
      const totalAmount = Math.round(getCartTotal() * 1.015 * 100); 

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "USD",
        }),
      });

      const data = await response.json();

      if (data.clientSecret) {
        // Redirect to a Stripe Elements page or open Stripe Checkout
        alert("Proceeding to secure checkout via Stripe...");
        // Here you would integrate with Stripe.js Elements
      } else {
        throw new Error(data.error || "Could not initialize checkout");
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#ffffff", borderRadius: "2rem", border: "1px solid #e2e8f0", padding: "40px", maxWidth: "600px", margin: "0 auto", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#014d4e", marginBottom: "24px" }}>
        <ShieldCheck size={18} />
        <span style={{ fontSize: "9px", fontWeight: "900", letterSpacing: "0.3em", textTransform: "uppercase" }}>
          Bazaria Secure Checkout
        </span>
      </div>

      <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a", marginBottom: "32px" }}>
        Confirm Transaction
      </h2>

      <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        <div style={{ borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", padding: "24px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b" }}>Subtotal</span>
            <span style={{ fontSize: "12px", fontWeight: "900", color: "#0f172a" }}>
              ${(getCartTotal()).toFixed(2)} USD
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b" }}>Platform Fee (1.5%)</span>
            <span style={{ fontSize: "12px", fontWeight: "900", color: "#0f172a" }}>
              ${(getCartTotal() * 0.015).toFixed(2)} USD
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
            <span style={{ fontSize: "11px", fontWeight: "900", color: "#014d4e" }}>Total Amount</span>
            <span style={{ fontSize: "18px", fontWeight: "900", color: "#014d4e" }}>
              ${(getCartTotal() * 1.015).toFixed(2)} USD
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={processing || items.length === 0}
          style={{
            width: "100%",
            backgroundColor: "#014d4e",
            color: "#ffffff",
            padding: "20px",
            borderRadius: "16px",
            border: "none",
            fontSize: "12px",
            fontWeight: "900",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: items.length === 0 || processing ? "not-allowed" : "pointer",
            opacity: items.length === 0 || processing ? 0.5 : 1
          }}
        >
          {processing ? "Connecting to secure gateway..." : "Pay with Card"}
        </button>
      </form>
    </div>
  );
}
