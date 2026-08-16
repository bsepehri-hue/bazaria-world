"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust this path if your db is exported from somewhere else!
import { ArrowLeft, Trash2, ShieldCheck, CreditCard } from "lucide-react";
import { FastPaymentSelector } from "@/components/checkout/FastPaymentSelector";
import { useCart } from "@/context/CartContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Autocomplete from "react-google-autocomplete";

// ⚡ 1. IMPORT WAGMI WEB3 HOOKS
import { useAccount, useConnect, useWriteContract, useSwitchChain } from "wagmi";

export default function CheckoutPage() {
  const { items, removeItem, getCartTotal, addItem } = useCart();
  
 // ⚡ 2. INITIALIZE METAMASK CONNECTIONS
  const { isConnected, address: walletAddress, chainId: currentWalletChainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();
  
  const { user } = useAuth();
  const [agentTokens, setAgentTokens] = useState<number>(0);
  
  // 👇 DROP THIS LINE BACK IN RIGHT HERE:
  const [isMounted, setIsMounted] = useState(false);
  
  // 🎯 Payment & tracking states for hybrid routing logic
  const [selectedMethod, setSelectedMethod] = useState<"card" | "ach" | "crypto" | "paypal" | "tokens">("card");
  const [activeWallet, setActiveWallet] = useState<string | null>(null);

  // 📦 Fee and calculating states
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [taxCost, setTaxCost] = useState<number>(0);
  const [isCalculatingFees, setIsCalculatingFees] = useState<boolean>(false);

  // 🎯 New states to handle multiple FedEx options
  const [availableShippingRates, setAvailableShippingRates] = useState<any[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>("");

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US"
  });

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

 // 🚚 DYNAMIC RATE TRACKER AUTOMATION
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
        
        // 👇 NEW: Handle the array of rates instead of a single rate
        if (shippingData.rates && shippingData.rates.length > 0) {
          setAvailableShippingRates(shippingData.rates);
          
          // Auto-select the first option by default so the cart doesn't break
          const defaultRate = shippingData.rates[0];
          setSelectedShippingMethod(defaultRate.serviceName);
          setShippingCost(defaultRate.rate);
        }
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

  // 🪙 FETCH LIVE AGENT TOKEN BALANCE (Safely Kept!)
  useEffect(() => {
    if (!user?.uid) return;
    
    const fetchTokens = async () => {
      try {
        const partnerRef = doc(db, "partners", user.uid);
        const partnerSnap = await getDoc(partnerRef);
        
        if (partnerSnap.exists() && partnerSnap.data().available) {
          setAgentTokens(partnerSnap.data().available);
        }
      } catch (err) {
        console.error("Failed to fetch agent tokens:", err);
      }
    };
    
    fetchTokens();
  }, [user]);

  // 🧮 ORDER SUMMARY MATH BREAKDOWN (NOW FULLY REACTIVE!)
  const safeItems = items || []; 
  const subtotalAmount = safeItems.reduce((acc: any, item: any) => acc + (item.price / 1.03) * (item.quantity || 1), 0);
  
  const needsShippingFee = safeItems.some((item: any) => !item.isDigital);
  const callTagFee = needsShippingFee ? 5 : 0;
  const totalShippingAndHandling = (shippingCost || 0) + callTagFee; 
  const buyerPremium = subtotalAmount * 0.03; 

  // 🌍 DYNAMIC TAX ENGINE (Calculates instantly on shipping changes)
  let localTaxRate = 0; 
  if (shippingAddress.country === "US") {
    const state = shippingAddress.state?.toUpperCase();
    if (state === "CA") localTaxRate = 0.0825;
    else if (state === "FL") localTaxRate = 0.0700;
    else if (state === "TX") localTaxRate = 0.0625;
    else if (state === "NY") localTaxRate = 0.0400;
  }
  
  const taxableAmount = subtotalAmount + buyerPremium + totalShippingAndHandling;
  // Note: Since we pulled tax out of state, we just declare it as a constant here
  const derivedTaxCost = taxableAmount * localTaxRate; 
  
  const grandTotalAmount = subtotalAmount + totalShippingAndHandling + derivedTaxCost + buyerPremium;

// 💳 SECURE PAYMENT PIPELINE HANDLER
  const handleCompletePayment = async () => {
    if (items.length === 0) return;

 // 👇 UPGRADED TOKEN INTERCEPTOR BLOCK
    if (selectedMethod === "tokens") {
      try {
        const response = await fetch('/api/checkout/token-purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentUid: user.uid,
            items: safeItems,
            grandTotalAmount: grandTotalAmount
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(`Transaction Failed: ${data.error}`);
          return;
        }

        // Success! Send them to the exact same success screen as fiat buyers
        window.location.href = "/market/checkout?success=true";
        
      } catch (err) {
        console.error("Token Execution Error:", err);
        alert("Could not process token transaction. Please try again.");
      }
      return;
    }

    // 🪙 CRYPTO EXECUTION: WAKE UP METAMASK
    if (selectedMethod === "crypto") {
      if (!isConnected) {
        alert("Please click 'Connect MetaMask' below before submitting.");
        return;
      }
      try {
        const AMOY_CHAIN_ID = 80002;
        if (currentWalletChainId !== AMOY_CHAIN_ID && switchChainAsync) {
          await switchChainAsync({ chainId: AMOY_CHAIN_ID });
        }
        
        // Convert grand total to atomic USDC (6 decimals)
        const usdcAtomicValue = BigInt(Math.round(grandTotalAmount * 1_000_000));
        const USDC_MARKET_ADDRESS = "0x875B0406cAfeE6C097065c9979aFdFd6058b609b";
        const MARKETPLACE_CONTRACT = "0x7c211077dBb177a4b2a551DA7CdC3D53b04Cbdb7";

        // 👇 ADD THIS VERIFICATION CHECK
        const userConfirmed = window.confirm(`Authorize a secure Web3 payment of $${grandTotalAmount.toFixed(2)} USDC?`);
        if (!userConfirmed) return; // Stops the transaction if they click Cancel

        await writeContractAsync({
          chainId: AMOY_CHAIN_ID,
          address: USDC_MARKET_ADDRESS as `0x${string}`,
          abi: [{ inputs: [{ name: "_spender", type: "address" }, { name: "_value", type: "uint256" }], name: "approve", outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" }],
          functionName: "approve",
          args: [MARKETPLACE_CONTRACT as `0x${string}`, usdcAtomicValue],
        });

        alert("Transaction successful! Securing your assets...");
        window.location.href = "/market/checkout?success=true";
      } catch (err: any) {
        console.error("Crypto Error:", err);
        alert(err.message || "Crypto payment failed or was rejected.");
      }
      return;
    }

    // 🚀 FIAT METHOD (Stripe logic)
    if (selectedMethod === "card" || selectedMethod === "ach") {
      console.log(`🚀 STRIPE ESCROW PORTAL INITIATED: Injecting pipeline details for method: ${selectedMethod}`);
      
      try {
       const dynamicCartItems = items.map((item: any) => ({
          id: item.id,
          title: item.title || "Sovereign Ledger Asset",
          price: item.price, 
          quantity: item.quantity || 1,
          category: item.category || "marketplace_assets",
          // 👇 CHANGED: Prioritize sellerId so the webhook gets the real Firebase Document ID
          ownerId: item.sellerId || item.ownerId || "steward_node_id", 
        }));

      // Generate a unique order ID for the Stripe Transfer Group
        const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: grandTotalAmount, 
            orderId: orderId,              // 👈 Send the unique group ID
            items: dynamicCartItems,       // 👈 Send the actual cart items!
            assetId: safeItems[0]?.id || "MULTI_ITEM_CART",
            isDigital: safeItems[0]?.isDigital || false
          }),
        });

        const data = await response.json();
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
          return;
        } else {
          alert("Handshake established, but payload return format mismatch.");
        }

      } catch (err) {
        console.error("❌ CRITICAL ROUTING FAILURE:", err);
        alert("Could not establish a connection link with the payment server.");
      }
      return;
    } // <--- THIS correctly closes the Fiat block

  }; // <--- THIS correctly closes the handleCompletePayment function

  

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
                name="street" 
                placeholder="2973 Harbor Blvd"
                value={shippingAddress.street}
                onChange={handleShippingInputChange}
                style={{ padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", color: "#0f172a" }}
              />
            </div>
              
              {/* City, State, Zip Row */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>City</label>
                  <input 
                    type="text" 
                    name="city"
                    placeholder="Costa Mesa"
                    value={shippingAddress.city}
                    onChange={handleShippingInputChange}
                    style={{ padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", color: "#0f172a" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>State</label>
                  <input 
                    type="text" 
                    name="state"
                    placeholder="CA"
                    maxLength={2}
                    value={shippingAddress.state}
                    onChange={handleShippingInputChange}
                    style={{ padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", textAlign: "center", color: "#0f172a" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Zip Code</label>
                  <input 
                    type="text" 
                    name="zipCode"
                    placeholder="92626"
                    value={shippingAddress.zipCode}
                    onChange={handleShippingInputChange}
                    style={{ padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", textAlign: "center", color: "#0f172a" }}
                  />
                </div>
              </div>
            </div>

            {/* 📦 FEDEX SHIPPING METHOD SELECTOR */}
            {availableShippingRates.length > 0 && (
              <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #f1f5f9" }}>
                <h4 style={{ fontSize: "10px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                  Select Shipping Service
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {availableShippingRates.map((rateObj: any, idx: number) => (
                    <label 
                      key={idx} 
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "space-between",
                        padding: "16px", 
                        border: selectedShippingMethod === rateObj.serviceName ? "2px solid #10b981" : "1px solid #e2e8f0", 
                        backgroundColor: selectedShippingMethod === rateObj.serviceName ? "#f0fdf4" : "#ffffff",
                        borderRadius: "12px", 
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <input 
                          type="radio" 
                          name="shippingService" 
                          value={rateObj.serviceName}
                          checked={selectedShippingMethod === rateObj.serviceName}
                          onChange={() => {
                            setSelectedShippingMethod(rateObj.serviceName);
                            setShippingCost(rateObj.rate);
                          }}
                          style={{ accentColor: "#10b981", width: "16px", height: "16px" }}
                        />
                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                          {rateObj.serviceName.replace(/_/g, " ")}
                        </span>
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: "900", color: "#014d4e" }}>
                        ${rateObj.rate.toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

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
                    <span>Asset Purchase Price</span>
                    <span>${subtotalAmount.toFixed(2)} USD</span>
                  </div>

                  {/* 💎 3% PLATFORM PREMIUM */}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b" }}>
                    <span>Platform Premium (3%)</span>
                    <span>${buyerPremium.toFixed(2)} USD</span>
                  </div>

                  {/* 📦 BUNDLED SHIPPING & HANDLING */}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b" }}>
                    <span>Shipping & Handling</span>
                    <span>
                      {(shippingCost > 0 || needsShippingFee) 
                        ? `$${totalShippingAndHandling.toFixed(2)} USD` 
                        : "Calculated at entry"}
                    </span>
                  </div>

                  {/* 🧾 RESTORED TAX ROW */}
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
            {/* 🟡 CHANGED: gridTemplateColumns to support 4 columns instead of 3 */}
            <div style={{ display: "grid", gap: "16px" }} className="grid-cols-1 md:grid-cols-4">
              
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

              {/* 🟡 NEW: Option 2: PayPal */}
              <button
                type="button"
                onClick={() => setSelectedMethod("paypal")}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: selectedMethod === "paypal" ? "2px solid #10b981" : "2px solid #e2e8f0",
                  backgroundColor: selectedMethod === "paypal" ? "#f0fdf4" : "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <span style={{ fontWeight: "700", fontSize: "14px", color: selectedMethod === "paypal" ? "#047857" : "#334155" }}>
                  PayPal Checkout
                </span>
                <span style={{ fontSize: "11px", color: "#64748b", textAlign: "center" }}>
                  Global trust, mobile express, and local currency
                </span>
              </button>

              {/* Option 3: High-Ticket Bank Debit (ACH) */}
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

              {/* Option 4: Web3 Ledger (Crypto) */}
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

{/* 👇 Option 5: Bazaria Tokens (Only shows if they are logged in) */}
              {user && (
                <button
                  type="button"
                  onClick={() => setSelectedMethod("tokens")}
                  disabled={agentTokens < grandTotalAmount}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border: selectedMethod === "tokens" ? "2px solid #FFBF00" : "2px solid #e2e8f0",
                    backgroundColor: selectedMethod === "tokens" ? "#fffbeb" : "transparent",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: agentTokens < grandTotalAmount ? "not-allowed" : "pointer",
                    opacity: agentTokens < grandTotalAmount ? 0.5 : 1,
                    transition: "all 0.2s"
                  }}
                >
                  <span style={{ fontWeight: "700", fontSize: "14px", color: selectedMethod === "tokens" ? "#b45309" : "#334155" }}>
                    Bazaria Tokens
                  </span>
                  <span style={{ fontSize: "11px", color: "#64748b", textAlign: "center" }}>
                    Balance: {agentTokens.toFixed(2)}
                    {agentTokens < grandTotalAmount && (
                      <span style={{ color: "#ef4444", display: "block", marginTop: "4px", fontWeight: "bold" }}>
                        Insufficient Balance
                      </span>
                    )}
                  </span>
                </button>
              )}
              
            </div>

          {/* Inline Web3 Connection Layer (Shows up only if Crypto is highlighted) */}
            {selectedMethod === "crypto" && (
              <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1", textAlign: "center" }}>
                {isConnected && walletAddress ? (
                  <p style={{ fontSize: "12px", color: "#0f172a", fontFamily: "monospace", margin: 0 }}>
                    ✅ Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => connect({ connector: connectors[0] })}
                    style={{ padding: "10px 20px", backgroundColor: "#1e293b", color: "#ffffff", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "900", cursor: "pointer", textTransform: "uppercase" }}
                  >
                    Connect MetaMask
                  </button>
                )}
              </div>
            )}

        {/* 🟡 SECURE PAYPAL EXECUTION LAYER */}
            {selectedMethod === "paypal" && (
              <div style={{ marginTop: "20px" }}>
                <PayPalScriptProvider 
                  options={{ 
                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
                    currency: "USD"
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                    
// 1. CREATE ORDER: Pings your secure backend to save the DB doc and generate the PayPal ID
                    createOrder={async (data, actions) => {
                      const response = await fetch("/api/paypal/create-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          amount: getCartTotal(), // 👈 Now safely uses your cart function
                          items: items,           // 👈 Now safely uses your cart array
                          deliveryMethod: typeof wantsShipping !== 'undefined' && wantsShipping ? "SHIPPING" : "PICKUP",
                          buyerAddress: typeof buyerAddress !== 'undefined' ? buyerAddress : null,
                          merchantAddress: typeof merchantAddress !== 'undefined' ? merchantAddress : null
                        }),
                      });
                      
                      const orderData = await response.json();
                      if (orderData.error) throw new Error(orderData.error);
                      
                      return orderData.id; 
                    }}

                    // 2. APPROVE ORDER: Captures the funds on the backend once the user clicks "Pay"
                    onApprove={async (data, actions) => {
                      console.log("🚀 User approved PayPal modal. Capturing funds...");
                      
                      const response = await fetch("/api/paypal/capture-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ orderID: data.orderID }),
                      });
                      
                      const captureData = await response.json();
                      
                      if (captureData.success) {
                        // Redirects to success page, triggering the exact same flow as Stripe!
                        window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/market/checkout?success=true`;
                      } else {
                        alert("Payment capture failed. Please try again.");
                      }
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}

          </div>
        )}

        {/* Proceed Button */}
        {/* 🟡 CHANGED: Added display: "none" when PayPal is selected to avoid double-submit confusion */}
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
            display: selectedMethod === "paypal" ? "none" : "flex", 
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
