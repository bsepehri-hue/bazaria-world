"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../../hooks/useCart";

// Initialize Stripe. Use an empty string if environment variable isn't loaded yet.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

export function StripeCheckout() {
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (cart.items.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Call your server/API route to create a Checkout Session or Payment Intent
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cart.items }),
      });

      const session = await response.json();

      if (session.error) {
        setError(session.error);
        setLoading(false);
        return;
      }

      // 2. Redirect to Stripe Checkout page
      const stripe = await stripePromise;
      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (result.error) {
          setError(result.error.message || "An error occurred during checkout.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the payment gateway.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "16px", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
      <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#6b7280" }}>
        Secure checkout powered by Stripe.
      </p>
      
      {error && <div style={{ color: "#ef4444", fontSize: "12px", marginBottom: "12px" }}>{error}</div>}

      <button
        onClick={handleCheckout}
        disabled={loading || cart.items.length === 0}
        style={{
          width: "100%",
          backgroundColor: "#FFBF00",
          color: "#004d40",
          padding: "10px 0",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          fontSize: "14px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? "0.6" : "1",
        }}
      >
        {loading ? "Redirecting to Payment..." : "Pay with Stripe"}
      </button>
    </div>
  );
}
