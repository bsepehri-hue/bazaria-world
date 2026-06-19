"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Trash2, ShieldCheck, CreditCard } from "lucide-react";
import { FastPaymentSelector } from "@/components/checkout/FastPaymentSelector";
// ⚡ 1. Import your true global cart hook
import { useCart } from "@/context/CartContext"; 

export default function CheckoutPage() {
  // ⚡ 2. Connect straight to your global reactive state machine
  // This completely replaces your local items, update, and remove states!
  const { items, removeItem, getCartTotal, addItem } = useCart();
  
  const [isMounted, setIsMounted] = useState(false);

  // 📦 Fee and calculating states
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [taxCost, setTaxCost] = useState<number>(0);
  const [isCalculatingFees, setIsCalculatingFees] = useState<boolean>(false);

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US"
  });

  // 🎯 Payment & tracking states for hybrid routing logic
  const [selectedMethod, setSelectedMethod] = useState<"card" | "ach" | "crypto">("card");
  const [activeWallet, setActiveWallet] = useState<string | null>(null);

  // Unified input handler for form fields
  const handleShippingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: name === "state" ? value.toUpperCase() : value
    }));
  };

  // Lifecycle hydration check
  useEffect(() => {
    setIsMounted(true);
    
    // Self-healing check for Stripe redirects
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      console.log("🎉 SUCCESS PARAMETER DETECTED: Flushing cart target repositories...");
      localStorage.removeItem("bazaria_cart"); 
      localStorage.removeItem("cart"); 
      window.location.href = "/market";
    }
  }, []);

  // 🚚 DYNAMIC RATE TRACKER AUTOMATION: Fires instantly when zip or global items array mutates
  useEffect(() => {
    if (!isMounted || items.length === 0 || !shippingAddress.zipCode?.trim()) return;

    const fetchLiveQuotesAndTaxes = async () => {
      setIsCalculatingFees(true);
      try {
        const standardAddress = {
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zipCode,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country
        };

        const res = await fetch("/api/shipping/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            fromAddress: { street: "2973 Harbor Blvd", city: "Costa Mesa", state: "CA", zip: "92626", country: "US" },
            toAddress: standardAddress,
            packageDetails: { weight: 12, length: 24, width: 18, height: 6 },
            isOversized: false,
            carrierPreference: "FEDEX",
            items, 
            address: standardAddress 
          })
        });

        const shippingData = await res.json();
        const liveFedExRate = shippingData.rate || shippingData.price || (shippingData.rates && shippingData.rates[0]?.baseRate) || 0;
        setShippingCost(liveFedExRate);

        // Tax Math Engine
        const subtotal = items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
        const localTaxRate = shippingAddress.state === "CA" ? 0.0825 : 0.07; 
        setTaxCost(subtotal * localTaxRate);

      } catch (error) {
        console.error("❌ DYNAMIC CHECKOUT FEE RESOLUTION ERROR:", error);
      } finally {
        setIsCalculatingFees(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchLiveQuotesAndTaxes();
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [shippingAddress.zipCode, shippingAddress.state, items, isMounted]);

  // 🧮 ORDER SUMMARY MATH BREAKDOWN (Now tied directly to global context items array)
  const subtotalAmount = items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const grandTotalAmount = subtotalAmount + shippingCost + taxCost;

  // 💳 SECURE PAYMENT PIPELINE HANDLER

  // 💳 SECURE PAYMENT PIPELINE HANDLER
  const handleCompletePayment = async () => {
    if (items.length === 0) return;

    if (selectedMethod === "crypto" && !activeWallet) {
      alert("Please click 'Connect your wallet' inline before submitting your checkout with cryptocurrency.");
      return;
    }

    console.log(`Executing transaction payload via channel: ${selectedMethod}`, activeWallet ? `Wallet target: ${activeWallet}` : "");
    
    // 🚀 FIAT METHOD (Handles both Card and ACH)
    if (selectedMethod === "card" || selectedMethod === "ach") {
      console.log(`🚀 STRIPE ESCROW PORTAL INITIATED: Injecting pipeline details for method: ${selectedMethod}`);
      
      try {
        const dynamicCartItems = items.map((item: any) => ({
          id: item.id,
          title: item.title || "Sovereign Ledger Asset",
          price: item.price, 
          quantity: item.quantity || 1,
          category: item.category || "marketplace_assets",
          ownerId: item.ownerId || "steward_node_id",
        }));

        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Ensure you are passing the total amount from your cart math
            amount: Math.round(finalCartTotal * 100), 
            
            // ⚡ FIXED: Pull the ID from the first item in the cart array!
            assetId: cartItems[0]?.id || cart[0]?.id || "MULTI_ITEM_CART", 
            
            isDigital: cartItems[0]?.isDigital || false
          }),
        });

        const data = await response.json();
        
        // 🎯 TARGETED DEBUGGER: Print out the absolute raw truth from the server logs
        console.log("📥 SERVER GATEWAY RESPONSE DATA:", data);

        if (!response.ok) {
          console.error("❌ BACKEND VALIDATION FAILED:", data.error || data.message);
          alert(`Server Error (Status ${response.status}): ${data.error || "Bad Request"}`);
          return;
        }

        if (data.url) {
          console.log("🔗 Redirection URL validated. Launching Stripe Payment Panel...");
          window.location.href = data.url;
          return;
        } else if (data.clientSecret) {
          console.log("💳 CLIENT SECRET RECEIVED FOR INLINE CHECKOUT:", data.clientSecret);
          // This means your backend is built for an embedded form, not a checkout redirect!
          return;
        } else {
          alert("Handshake established, but payload return format mismatch.");
        }

      } catch (err) {
        console.error("❌ CRITICAL ROUTING FAILURE:", err);
        alert("Could not establish a connection link with the payment server.");
      }
      return;
    }

    alert(`Order successfully initialized via ${selectedMethod.toUpperCase()}! Total: $${grandTotalAmount.toFixed(2)} USD`);
  };

  if (!isMounted) {
    return <div style={{ backgroundColor: "#f8f8f5", minHeight: "100vh" }} />;
  }

  const isPaymentSuccess = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("success") === "true";

  if (isPaymentSuccess) {
    return (
      <div style={{ backgroundColor: "#f8f8f5", minHeight: "100vh", padding: "40px 20px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ maxWidth: "500px", width: "100%", backgroundColor: "#ffffff", borderRadius: "28px", textAlign: "center", boxShadow: "0 15px 35px rgba(0,0,0,0.04)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg, #0d1527 0%, #052219 100%)", padding: "32px 20px", display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "4px solid #014d4e" }}>
            <img 
              src="/icons/icon-192x192.png" 
              alt="Bazaria Logo" 
              style={{ width: "220px", height: "auto", objectFit: "contain" }} 
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div style={{ padding: "40px 36px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#e6f4f0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#014d4e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <h2 style={{ color: "#014d4e", fontSize: "24px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>
              Thank You
            </h2>
            
            <p style={{ color: "#111111", fontSize: "16px", fontWeight: "700", margin: "0 0 12px" }}>
              Your payment was completed successfully!
            </p>
            
            <p style={{ color: "#666666", fontSize: "14px", lineHeight: "1.6", margin: "0 0 36px" }}>
              Your transaction payload has been secured on the escrow layer. Your sovereign ledger assets are being allocated to your inventory balance.
            </p>

            <button
              onClick={() => (window.location.href = "/market")}
              style={{
                width: "100%",
                backgroundColor: "#014d4e",
                color: "#ffffff",
                padding: "18px",
                borderRadius: "14px",
                border: "none",
                fontSize: "12px",
                fontWeight: "900",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(1, 77, 78, 0.2)",
                transition: "all 0.2s ease"
              }}
            >
              Return to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
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

        {/* 📬 SHIPPING DESTINATION ADDRESS FORM */}
        {items.length > 0 && (
          <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "2rem", border: "1px solid #e2e8f0", marginBottom: "32px" }}>
            <h3 style={{ color: "#014d4e", fontSize: "14px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 24px 0", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
              Shipping Destination
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Street Address */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "10px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Street Address</label>
              <input 
                type="text" 
                name="street" // ⚡ Bound name
                placeholder="2973 Harbor Blvd"
                value={shippingAddress.street}
                onChange={handleShippingInputChange} // ⚡ Reactive Handler
                style={{ padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", color: "#0f172a" }}
              />
            </div>

            {/* City, State, Zip Row */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "10px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>City</label>
                <input 
                  type="text" 
                  name="city" // ⚡ Bound name
                  placeholder="Costa Mesa"
                  value={shippingAddress.city}
                  onChange={handleShippingInputChange} // ⚡ Reactive Handler
                  style={{ padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", color: "#0f172a" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "10px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>State</label>
                <input 
                  type="text" 
                  name="state" // ⚡ Bound name
                  placeholder="CA"
                  maxLength={2}
                  value={shippingAddress.state}
                  onChange={handleShippingInputChange} // ⚡ Reactive Handler
                  style={{ padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", textAlign: "center", color: "#0f172a" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "10px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Zip Code</label>
                <input 
                  type="text" 
                  name="zipCode" // ⚡ Bound name
                  placeholder="92626"
                  value={shippingAddress.zipCode}
                  onChange={handleShippingInputChange} // ⚡ Reactive Handler
                  style={{ padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", textAlign: "center", color: "#0f172a" }}
                />
              </div>
            </div>
            </div>

            {/* Live Fee Processing Spinner */}
            {isCalculatingFees && (
              <div style={{ marginTop: "16px", fontSize: "11px", color: "#014d4e", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "12px", height: "12px", border: "2px solid #014d4e", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 1s linear infinite" }}></span>
                Calculating carrier shipping rates...
              </div>
            )}
          </div>
        )}

        {/* Dynamic Summary List */}
        <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "2rem", border: "1px solid #e2e8f0", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "900", color: "#014d4e", marginBottom: "20px", uppercase: "true", tracking: "0.05em" }}>
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
                    <h4 style={{ fontSize: "11px", fontWeight: "900", color: "#014d4e", marginBottom: "4px" }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: "9px", color: "#64748b", textTransform: "uppercase", marginBottom: "8px" }}>
                      {item.category}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", fontWeight: "900", color: "#014d4e" }}>
                        ${item.price.toFixed(2)} USD
                      </span>
                      
                      {/* 🔄 THE FIX: DROP INTERACTIVE CONTROL MATRIX DIRECTLY IN THE ORDER SUMMARY LIST */}
                      <div 
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "8px", 
                          border: "1px solid #cbd5e1", 
                          padding: "2px 6px", 
                          borderRadius: "6px", 
                          backgroundColor: "#ffffff"
                        }}
                        className="select-none"
                      >
                       <button 
  onClick={(e) => {
    e.preventDefault();
    const currentQty = item.quantity || 1;
    removeItem(item.id); // Clear out the current array index
    if (currentQty > 1) {
      // Put it back with exactly 1 less quantity unit
      addItem({ ...item, quantity: currentQty - 1 });
    }
  }}
  style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "12px", fontWeight: "900" }}
>
  −
</button>
                      
                        {/* 🛡️ ROCK-SOLID CONTAINER: Stabilizes structural dimensions to eliminate layout twitching */}
                        <span style={{ 
                          fontSize: "11px", 
                          color: "#0f172a", 
                          fontWeight: "900", 
                          fontFamily: "monospace", 
                          display: "inline-block",
                          width: "24px", 
                          textAlign: "center",
                          fontVariantNumeric: "tabular-nums" // Standardizes width across all digits (e.g., 1 vs 2)
                        }}>
                          {item.quantity || 1}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const currentQty = item.quantity || 1;
                            removeItem(item.id);
                            addItem({ ...item, quantity: currentQty + 1 });
                          }}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "12px", fontWeight: "900" }}
                          className="hover:text-emerald-600 transition-colors"
                        >
                          +
                        </button>
                      </div>

                    </div>
                  </div>
                  <button
                    
                    onClick={() => removeItem(item.id)}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "8px" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {/* Dynamic Fee Item Breakdown Rows */}
              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px", marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b" }}>
                  <span>Cart Subtotal</span>
                  <span>${subtotalAmount.toFixed(2)} USD</span>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b" }}>
                  <span>FedEx Shipping Quote</span>
                  <span>{shippingCost > 0 ? `$${shippingCost.toFixed(2)} USD` : "Calculated at entry"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
                  <span>Localized Sales Tax</span>
                  <span>{taxCost > 0 ? `$${taxCost.toFixed(2)} USD` : "Calculated at entry"}</span>
                </div>

                {/* Total Invoice */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ display: "block", fontSize: "8px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      Total Invoice Amount
                    </span>
                    <span style={{ fontSize: "20px", fontWeight: "900", color: "#014d4e" }}>
                      ${grandTotalAmount.toFixed(2)} <span style={{ fontSize: "10px", color: "#94a3b8" }}>USD</span>
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#014d4e" }}>
                    <ShieldCheck size={14} />
                    <span style={{ fontSize: "8px", fontWeight: "900", textTransform: "uppercase" }}>Verified</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

       {/* 🎯 INLINE FORM OF PAYMENT MATRIX SELECTION CARD */}
        {items.length > 0 && (
          <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "2rem", border: "1px solid #e2e8f0", marginBottom: "32px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "16px", color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Select Payment Method
            </h3>
            
            {/* 💳 UNIFIED ULTRA-MODERN PAYMENT METHOD CHANNELS */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="md:grid-cols-3">
              
              {/* Option 1: Card & Mobile Wallets */}
              <button
                type="button"
                onClick={() => setSelectedMethod("card")}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: selectedMethod === "card" ? "2px solid #10b981" : "2px solid #e2e8f0",
                  backgroundColor: selectedMethod === "card" ? "#f0fdf4" : "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <span style={{ fontWeight: "700", fontSize: "14px", color: selectedMethod === "card" ? "#047857" : "#334155" }}>
                  Card, Apple & Google Pay
                </span>
                <span style={{ fontSize: "11px", color: "#64748b", textAlign: "center" }}>
                  Instant verification & express biometric checkout
                </span>
              </button>

              {/* Option 2: High-Ticket Bank Debit (ACH) */}
              <button
                type="button"
                onClick={() => setSelectedMethod("ach")}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: selectedMethod === "ach" ? "2px solid #10b981" : "2px solid #e2e8f0",
                  backgroundColor: selectedMethod === "ach" ? "#f0fdf4" : "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <span style={{ fontWeight: "700", fontSize: "14px", color: selectedMethod === "ach" ? "#047857" : "#334155" }}>
                  Bank Transfer (ACH)
                </span>
                <span style={{ fontSize: "11px", color: "#64748b", textAlign: "center" }}>
                  Secure bank login. Capped fees. Perfect for high-ticket items
                </span>
              </button>

              {/* Option 3: Web3 Ledger (Crypto) */}
              <button
                type="button"
                onClick={() => setSelectedMethod("crypto")}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: selectedMethod === "crypto" ? "2px solid #10b981" : "2px solid #e2e8f0",
                  backgroundColor: selectedMethod === "crypto" ? "#f0fdf4" : "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <span style={{ fontWeight: "700", fontSize: "14px", color: selectedMethod === "crypto" ? "#047857" : "#334155" }}>
                  Cryptocurrency
                </span>
                <span style={{ fontSize: "11px", color: "#64748b", textAlign: "center" }}>
                  Pay via Polygon Amoy Web3 Smart Contract Escrow
                </span>
              </button>

            </div>

            {/* Inline Web3 Connection Layer (Shows up only if Crypto is highlighted) */}
            {selectedMethod === "crypto" && (
              <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1", textAlign: "center" }}>
                {activeWallet ? (
                  <p style={{ fontSize: "12px", color: "#0f172a", fontFamily: "monospace" }}>
                    Connected Wallet: {activeWallet.slice(0, 6)}...{activeWallet.slice(-4)}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveWallet("0x71C...319a")} // Mock address setup for sandbox mode
                    style={{ padding: "8px 16px", backgroundColor: "#1e293b", color: "#ffffff", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                  >
                    Connect Web3 Wallet
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Proceed Button */}
        <button
          disabled={items.length === 0}
          onClick={handleCompletePayment}
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
          <CreditCard size={14} /> Submit Order ({selectedMethod})
        </button>
      </div>
    </div>
  );
}
