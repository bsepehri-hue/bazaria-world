"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext"; // Adjust if your context folder is structured differently (e.g., '@/app/context/CartContext')

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { items, removeItem } = useCart();

  useEffect(() => {
    // 🧹 Clean wipe: Clear out remaining items globally from the state machine
    if (sessionId && items && items.length > 0) {
      items.forEach((item: any) => {
        try {
          removeItem(item.id);
        } catch (err) {
          console.error("Error clearing item from cart state:", err);
        }
      });
    }
  }, [sessionId, items, removeItem]);

  return (
    <div style={{ maxWidth: "600px", margin: "100px auto", padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>
      <div style={{ fontSize: "64px", marginBottom: "24px" }}>✅</div>
      <h1 style={{ fontSize: "32px", color: "#0f172a", fontWeight: "900", marginBottom: "16px", tracking: "-0.05em" }}>
        Transaction Authorized
      </h1>
      <p style={{ color: "#475569", fontSize: "16px", lineHeight: "1.6", marginBottom: "32px" }}>
        Your payment has been successfully secured via the Stripe Sandbox escrow channel. 
        The asset settlement logs are processing.
      </p>

      {sessionId && (
        <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", fontFamily: "monospace", fontSize: "12px", color: "#64748b", marginBottom: "32px", wordBreak: "break-all", border: "1px solid #e2e8f0" }}>
          Session Hash: {sessionId}
        </div>
      )}

      <Link 
        href="/market"
        style={{ display: "inline-block", background: "#0f172a", color: "#ffffff", padding: "14px 28px", borderRadius: "6px", fontWeight: "bold", textDecoration: "none", fontSize: "14px", transition: "background 0.2s" }}
      >
        Return to Marketplace
      </Link>
    </div>
  );
}
