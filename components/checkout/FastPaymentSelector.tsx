"use client";

import React, { useState, useEffect } from "react";
import { Wallet, CreditCard, Landmark, ShieldCheck } from "lucide-react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface FastPaymentSelectorProps {
  onMethodSelect: (method: "card" | "ach" | "crypto") => void;
  onWalletLinked: (address: string | null) => void;
  selectedMethod?: "card" | "ach" | "crypto";
}

export const FastPaymentSelector: React.FC<FastPaymentSelectorProps> = ({
  onMethodSelect,
  onWalletLinked,
  selectedMethod = "card",
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  // Sync initial state on mount
  useEffect(() => {
    onMethodSelect(selectedMethod);
  }, []);

  // Web3 Wallet Connection Handler for your Crypto Escrow option
  const connectWeb3Wallet = async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      alert("No Web3 wallet detected. Please install MetaMask or a compatible wallet extension.");
      return;
    }
    
    setIsConnectingWallet(true);
    try {
      const providers = (window as any).ethereum;
      const accounts = await providers.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setAccountAddress(address);
        onWalletLinked(address);
      }
    } catch (err: any) {
      console.error("Wallet connection failed:", err);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleChannelSwitch = (method: "card" | "ach" | "crypto") => {
    onMethodSelect(method);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* 🔮 CUSTOM ULTRA-MODERN PAYMENT CHANNEL SELECTION PILLS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
        
        {/* Channel 1: Credit/Debit Cards & Express Mobile Pay */}
        <button
          type="button"
          onClick={() => handleChannelSwitch("card")}
          style={{
            padding: "20px",
            borderRadius: "16px",
            border: selectedMethod === "card" ? "2px solid #014d4e" : "2px solid #e2e8f0",
            backgroundColor: selectedMethod === "card" ? "#f4f9f9" : "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            textAlign: "center"
          }}
        >
          <CreditCard size={20} color={selectedMethod === "card" ? "#014d4e" : "#64748b"} />
          <span style={{ fontWeight: "700", fontSize: "14px", color: "#014d4e" }}>Cards & Wallets</span>
          <span style={{ fontSize: "11px", color: "#64748b" }}>Apple Pay, Google Pay, Visa, Mastercard</span>
        </button>

        {/* Channel 2: High-Ticket Bank Transfers (ACH) */}
        <button
          type="button"
          onClick={() => handleChannelSwitch("ach")}
          style={{
            padding: "20px",
            borderRadius: "16px",
            border: selectedMethod === "ach" ? "2px solid #014d4e" : "2px solid #e2e8f0",
            backgroundColor: selectedMethod === "ach" ? "#f4f9f9" : "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            textAlign: "center"
          }}
        >
          <Landmark size={20} color={selectedMethod === "ach" ? "#014d4e" : "#64748b"} />
          <span style={{ fontWeight: "700", fontSize: "14px", color: "#014d4e" }}>Bank Transfer (ACH)</span>
          <span style={{ fontSize: "11px", color: "#64748b" }}>Secure bank login. Ideal for large amounts</span>
        </button>

        {/* Channel 3: Sovereign Crypto Asset Escrow */}
        <button
          type="button"
          onClick={() => handleChannelSwitch("crypto")}
          style={{
            padding: "20px",
            borderRadius: "16px",
            border: selectedMethod === "crypto" ? "2px solid #014d4e" : "2px solid #e2e8f0",
            backgroundColor: selectedMethod === "crypto" ? "#f4f9f9" : "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            textAlign: "center"
          }}
        >
          <Wallet size={20} color={selectedMethod === "crypto" ? "#014d4e" : "#64748b"} />
          <span style={{ fontWeight: "700", fontSize: "14px", color: "#014d4e" }}>Cryptocurrency</span>
          <span style={{ fontSize: "11px", color: "#64748b" }}>Polygon Amoy Web3 Smart Contract Escrow</span>
        </button>

      </div>

      {/* ⚡ REAL-TIME DYNAMIC VIEW CONTAINER PANELS */}
      <div style={{ marginTop: "8px", borderTop: "1px solid #f1f5f9", paddingTop: "24px" }}>
        
        {/* FIAT GATEWAY (Stripe Payment Element Wrapper for both Cards and ACH) */}
        {(selectedMethod === "card" || selectedMethod === "ach") && (
          <div style={{ animation: "fadeIn 0.2s ease" }}>
            {stripe && elements ? (
              <PaymentElement
                key={selectedMethod} // Forces fresh UI render when switching between tabs
                options={{
                  layout: {
                    type: "tabs",
                  },
                  paymentMethodOrder: selectedMethod === "ach" ? ["us_bank_account", "card"] : ["card", "us_bank_account"],
                }}
              />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", color: "#64748b", fontSize: "13px" }}>
                Loading secure checkout infrastructure...
              </div>
            )}
          </div>
        )}

        {/* WEB3 ENGINE OVERLAY PANEL */}
        {selectedMethod === "crypto" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", padding: "24px", backgroundColor: "#f8fafc", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0f172a" }}>
              <ShieldCheck size={18} color="#014d4e" />
              <span style={{ fontSize: "13px", fontWeight: "600" }}>Web3 Escrow Ledger Gate Active</span>
            </div>
            
            {accountAddress ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Connected Address</span>
                <code style={{ fontSize: "12px", backgroundColor: "#e2e8f0", padding: "6px 12px", borderRadius: "6px", fontFamily: "monospace", color: "#0f172a" }}>
                  {accountAddress.slice(0, 6)}...{accountAddress.slice(-4)}
                </code>
              </div>
            ) : (
              <button
                type="button"
                onClick={connectWeb3Wallet}
                disabled={isConnectingWallet}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#014d4e",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  opacity: isConnectingWallet ? 0.7 : 1,
                  transition: "opacity 0.2s"
                }}
              >
                {isConnectingWallet ? "Connecting..." : "Connect Web3 Wallet"}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
