"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Wallet, CreditCard, Landmark } from "lucide-react";
import { ethers } from "ethers";

interface FastPaymentProps {
  onMethodSelect: (method: "paypal" | "card" | "crypto") => void;
  onWalletLinked: (address: string) => void;
}

export function FastPaymentSelector({ onMethodSelect, onWalletLinked }: FastPaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<"paypal" | "card" | "crypto">("crypto");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    onMethodSelect(selectedMethod);
  }, [selectedMethod]);

  const handleConnectWallet = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!window.ethereum) {
      alert("No crypto wallet detected. Please install MetaMask.");
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts[0]) {
        setWalletAddress(accounts[0]);
        onWalletLinked(accounts[0]);
        setSelectedMethod("crypto");
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.mainTitle}>Form of payment</h3>

      <div style={styles.listContainer}>
        
        {/* 1. PAYPAL OPTION */}
        <div 
          onClick={() => setSelectedMethod("paypal")}
          style={{
            ...styles.rowOption,
            ...(selectedMethod === "paypal" ? styles.activeRow : {})
          }}
        >
          <div style={styles.leftMeta}>
            <Landmark style={styles.iconTeal} size={20} />
            <span style={styles.labelTitle}>Paypal</span>
          </div>
          {selectedMethod === "paypal" && <CheckCircle2 style={styles.checkIcon} size={20} />}
        </div>

        {/* 2. CREDIT CARD OPTION */}
        <div 
          onClick={() => setSelectedMethod("card")}
          style={{
            ...styles.rowOption,
            ...(selectedMethod === "card" ? styles.activeRow : {})
          }}
        >
          <div style={styles.leftMeta}>
            <CreditCard style={styles.iconTeal} size={20} />
            <span style={styles.labelTitle}>Credit Card</span>
          </div>
          {selectedMethod === "card" && <CheckCircle2 style={styles.checkIcon} size={20} />}
        </div>

        {/* 3. CRYPTO CURRENCY OPTION */}
        <div 
          onClick={() => setSelectedMethod("crypto")}
          style={{
            ...styles.rowOption,
            ...(selectedMethod === "crypto" ? styles.activeRow : {})
          }}
        >
          <div style={styles.leftMeta}>
            <Wallet style={styles.iconTeal} size={20} />
            <span style={styles.labelTitle}>Crypto currency</span>
          </div>
          
          <div style={styles.rightActionSlot}>
            {walletAddress ? (
              <div style={styles.connectedBadge}>
                <span style={styles.connectedText}>Connected</span>
                <CheckCircle2 style={styles.checkIcon} size={20} />
              </div>
            ) : (
              <button 
                onClick={handleConnectWallet}
                disabled={isConnecting}
                style={styles.connectInlineBtn}
              >
                {isConnecting ? "Connecting..." : "Connect your wallet"}
              </button>
            )}
            
            {selectedMethod === "crypto" && !walletAddress && (
              <CheckCircle2 style={styles.checkIcon} size={20} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "system-ui, -apple-system, sans-serif",
    backgroundColor: "#ffffff",
    padding: "16px 0",
    width: "100%",
  },
  mainTitle: {
    fontSize: "14px",
    fontWeight: "900" as const,
    color: "#014d4e",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: "20px",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  rowOption: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderRadius: "16px",
    // 🛠️ SEPARATED VALUES TO AVOID SHORTHAND CONFLICTS WITH REACT RE-RENDERS
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    cursor: "pointer",
    transition: "all 0.15s ease-in-out",
  },
  activeRow: {
    // 🎯 Now safely updates without conflicting with a shorthand "border" rule
    borderColor: "#014d4e",
    backgroundColor: "#f4fdfd",
  },
  leftMeta: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  labelTitle: {
    fontSize: "12px",
    fontWeight: "900" as const,
    color: "#014d4e",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  rightActionSlot: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  connectInlineBtn: {
    backgroundColor: "transparent",
    color: "#014d4e",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "#014d4e",
    borderRadius: "8px",
    padding: "6px 14px",
    fontSize: "10px",
    fontWeight: "900" as const,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  connectedBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "#d1fae5",
    padding: "4px 12px",
    borderRadius: "20px",
  },
  connectedText: {
    fontSize: "10px",
    fontWeight: "900" as const,
    color: "#065f46",
    textTransform: "uppercase" as const,
  },
  iconTeal: {
    color: "#014d4e",
  },
  checkIcon: {
    color: "#014d4e",
  }
};
