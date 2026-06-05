"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext"; // Adjust path if your context file sits elsewhere

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { items, removeItem } = useCart();
  const clearedRef = useRef(false);

  useEffect(() => {
    // Prevent React StrictMode double-triggering from causing state loops
    if (clearedRef.current) return;

    if (sessionId && items && items.length > 0) {
      clearedRef.current = true;
      // 🧹 Loop through remaining items in state and cleanly clear them out
      items.forEach((item: any) => {
        try {
          removeItem(item.id);
        } catch (err) {
          console.error("Error purging item from checkout state:", err);
        }
      });
    }
  }, [sessionId, items, removeItem]);

  return (
    <div style={{ maxWidth: "600px", margin: "100px auto", padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>
      <div style={{ fontSize: "64px", marginBottom: "24px" }}>✅</div>
      
      <h1 style={{ fontSize: "32px", color: "#0f172a", fontWeight: "900", marginBottom: "16px", letterSpacing: "-0.05em" }}>
        Transaction Authorized
      </h1>
      
      <p style={{ color: "#475569", fontSize: "16px", lineHeight: "1.6", marginBottom: "32px" }}>
        Your payment has been successfully secured via the Stripe Sandbox escrow channel. 
        The marketplace asset settlement logs are finalizing.
      </p>

      {sessionId && (
        <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", fontFamily: "monospace", fontSize: "12px", color: "#64748b", marginBottom: "32px", wordBreak: "break-all", border: "1px solid #e2e8f0" }}>
          <span style={{ fontWeight: "bold", color: "#0f172a" }}>SESSION HASH:</span> {sessionId}
        </div>
      )}

      <Link 
        href="/market"
        style={{ display: "inline-block", background: "#0f172a", color: "#ffffff", padding: "14px 28px", borderRadius: "6px", fontWeight: "bold", textDecoration: "none", fontSize: "14px" }}
      >
        Return to Marketplace
      </Link>
    </div>
  );
}
