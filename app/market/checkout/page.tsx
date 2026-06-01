"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Trash2, ShieldCheck, CreditCard } from "lucide-react";
// 🟢 Pulling in your standalone inline matrix card component
import { FastPaymentSelector } from "@/components/checkout/FastPaymentSelector";

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

  // 📦 Make sure these are sitting right up here at the top!
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
  const [selectedMethod, setSelectedMethod] = useState<"paypal" | "card" | "crypto">("crypto");
  const [activeWallet, setActiveWallet] = useState<string | null>(null);

  // 🏁 CONSOLIDATED MOUNT & SYNC LIFECYCLE
  useEffect(() => {
    setIsMounted(true);
    
    const params = new URLSearchParams(window.location.search);
    const isStripeSuccess = params.get("success") === "true";

    if (isStripeSuccess) {
      console.log("🎉 SUCCESS PARAMETER DETECTED: Flushing Bazaria cart state...");
      localStorage.removeItem("bazaria_cart"); 
      localStorage.removeItem("cart"); // Cleaning old fallback keys
      setItems([]);
      window.dispatchEvent(new Event("storage"));
      return; 
    }

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
    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, []);

  // 🚚 DYNAMIC RATE TRACKER AUTOMATION: Fires when Zip Code or Items change
  useEffect(() => {
    if (!isMounted || items.length === 0 || !shippingAddress.zipCode) return;

    const fetchLiveQuotesAndTaxes = async () => {
      setIsCalculatingFees(true);
      try {
        // 1. Fetch live FedEx quote from your existing shipping route
        const res = await fetch("/api/shipping/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, address: shippingAddress })
        });
        const shippingData = await res.json();
        
        // Match the exact response key your quote engine emits (e.g., rate or price)
        const liveFedExRate = shippingData.rate || shippingData.price || 0;
        setShippingCost(liveFedExRate);

        // 2. Fetch or Calculate Local Sales Tax
        const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        
        // Example: Apply localized rate (like 8.25%) dynamically to items
        const localTaxRate = shippingAddress.state === "CA" ? 0.0825 : 0.07; 
        const calculatedTax = subtotal * localTaxRate;
        setTaxCost(calculatedTax);

      } catch (error) {
        console.error("❌ DYNAMIC CHECKOUT FEE RESOLUTION ERROR:", error);
      } finally {
        setIsCalculatingFees(false);
      }
    };

    // Debounce the call slightly so it doesn't slam the API while the user is typing the zip
    const delayDebounce = setTimeout(() => {
      fetchLiveQuotesAndTaxes();
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [shippingAddress.zipCode, shippingAddress.state, items, isMounted]);

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
    window.dispatchEvent(new Event("storage"));
  };

  // 🧮 ORDER SUMMARY MATH BREAKDOWN
  const subtotalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const grandTotalAmount = subtotalAmount + shippingCost + taxCost; // $5 call tag handled purely on seller ledger balance downstream

  // 💳 SECURE PAYMENT PIPELINE HANDLER
  const handleCompletePayment = async () => {
    if (selectedMethod === "crypto" && !activeWallet) {
      alert("Please click 'Connect your wallet' inline before submitting your checkout with cryptocurrency.");
      return;
    }

    console.log(`Executing transaction payload via channel: ${selectedMethod}`, activeWallet ? `Wallet target: ${activeWallet}` : "");

    if (selectedMethod.toLowerCase() === "card") {
      console.log("🚀 STRIPE ESCROW PORTAL INITIATED: Injecting live FedEx and tax payload variables...");
      
      try {
        const dynamicCartItems = items.map((item: any) => ({
          id: item.id,
          title: item.title || "Sovereign Ledger Asset",
          price: item.price, 
          quantity: item.quantity || 1,
          category: item.category || "marketplace_assets",
          ownerId: item.ownerId || "steward_node_id",
        }));

        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems: dynamicCartItems,
            shippingCost: shippingCost, // Live FedEx rate passed straight to Stripe
            taxCost: taxCost,           // Dynamic local tax passed straight to Stripe
          }),
        });

        const data = await response.json();

        if (data.url) {
          console.log("🔗 Redirection URL validated. Launching Stripe Payment Panel...");
          window.location.href = data.url;
          return;
        } else {
          alert(data.error || "Stripe sandbox session building failed.");
        }
      } catch (err) {
        console.error("❌ CRITICAL ROUTING FAILURE:", err);
        alert("Could not establish a connection link with the payment server.");
      }
      return;
    }

    // 🪐 WEB3 / CRYPTO FALLBACK (Kept live for your wallet testing sequence)
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
          
          {/* Enhanced Logo Banner Header */}
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

          {/* Modal Content Body */}
          <div style={{ padding: "40px 36px" }}>
            {/* Green Success Badge */}
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
                  placeholder="123 Sovereign Way"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  style={{ padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none" }}
                />
              </div>

              {/* City, State, Zip Row */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>City</label>
                  <input 
                    type="text" 
                    placeholder="Miami"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    style={{ padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>State</label>
                  <input 
                    type="text" 
                    placeholder="FL"
                    maxLength={2}
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value.toUpperCase() })}
                    style={{ padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", textAlign: "center" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Zip Code</label>
                  <input 
                    type="text" 
                    placeholder="33101"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                    style={{ padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", textAlign: "center" }}
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" }}>
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
            <FastPaymentSelector 
              onMethodSelect={(method) => setSelectedMethod(method)}
              onWalletLinked={(address) => setActiveWallet(address)}
            />
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
