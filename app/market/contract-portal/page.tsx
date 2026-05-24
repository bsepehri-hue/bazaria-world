"use client";

import React, { useState } from "react";
import { connectBrowserWallet, triggerBlockchainBid, WalletState } from "@/lib/web3/contractService";

export default function ContractPortalPage() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    balance: null,
    chainId: null,
    isConnected: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  
  // Mock Data matching a premium asset block
  const assetDetails = {
    id: 4082,
    name: "Premium Mobility Asset (Custom Vessel)",
    reservePriceEth: "4.50 ETH",
    contractAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" // Standard test placeholder
  };

  const handleWalletConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const state = await connectBrowserWallet();
      setWallet(state);
    } catch (err: any) {
      setError(err.message || "Failed to establish secure cryptographic handshake.");
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteBid = async () => {
    if (!wallet.isConnected) {
      setError("Please connect your sovereign credentials before executing protocol bids.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setTxStatus("Awaiting user cryptographic signature...");
    
    try {
      // Simulate/trigger bid placement execution using our service layer
      const receipt = await triggerBlockchainBid(assetDetails.contractAddress, assetDetails.id, "4.75");
      setTxStatus(`Transaction finalized successfully! Block Hash: ${receipt.blockHash}`);
    } catch (err: any) {
      // Catch standard rejection parameters from MetaMask or gas failures
      setError(err.reason || err.message || "Transaction signature refused or reverted on-chain.");
      setTxStatus(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "12px" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ color: "#05292e", fontSize: "28px", fontWeight: "900", letterSpacing: "-0.5px" }}>
          Sovereign Registry & Escrow Interaction Portal
        </h1>
        <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
          Verify smart contract variables, manage secure Web3 keys, and interface directly with the Bazaria Settlement Layer.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Left Card: Asset Under Review */}
        <div style={{ backgroundColor: "#05292e", padding: "24px", borderRadius: "8px", color: "#ffffff" }}>
          <span style={{ color: "#FFBF00", fontSize: "11px", fontWeight: "700", letterSpacing: "1px" }}>
            IMMUTABLE CRYPTOGRAPHIC REGISTRY
          </span>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginTop: "8px", marginBottom: "16px" }}>
            {assetDetails.name}
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
            <div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Registry Asset ID:</span>
              <p style={{ fontFamily: "monospace", color: "#ffffff" }}>#{assetDetails.id}</p>
            </div>
            <div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Smart Contract Router:</span>
              <p style={{ fontFamily: "monospace", fontSize: "11px", color: "rgba(255,255,255,0.85)", wordBreak: "break-all" }}>
                {assetDetails.contractAddress}
              </p>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "12px", marginTop: "4px" }}>
              <span style={{ color: "#FFBF00" }}>Platform Floor / Reserve:</span>
              <p style={{ fontSize: "22px", fontWeight: "900", color: "#ffffff" }}>{assetDetails.reservePriceEth}</p>
            </div>
          </div>
        </div>

        {/* Right Card: Cryptographic Handshake Action Panel */}
        <div style={{ border: "1px solid #e5e7eb", padding: "24px", borderRadius: "8px", display: "flex", flexDirection: "column", justifyContent: "between" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#05292e", marginBottom: "16px" }}>
              Settlement Verification
            </h3>
            
            {wallet.isConnected ? (
              <div style={{ backgroundColor: "#f3f4f6", padding: "14px", borderRadius: "6px", fontSize: "13px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <p style={{ color: "#10b981", fontWeight: "700" }}>● Wallet Active</p>
                <p style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "monospace" }}>
                  <strong>Key:</strong> {wallet.address}
                </p>
                <p><strong>Available Assets:</strong> {wallet.balance} ETH</p>
              </div>
            ) : (
              <button
                onClick={handleWalletConnect}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#05292e",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Authorizing..." : "Connect Cryptographic Wallet"}
              </button>
            )}
          </div>

          <div style={{ marginTop: "24px" }}>
            <button
              onClick={handleExecuteBid}
              disabled={loading || !wallet.isConnected}
              style={{
                width: "100%",
                padding: "14px",
                background: wallet.isConnected ? "linear-gradient(90deg, #FFBF00 0%, #E5A100 100%)" : "#e5e7eb",
                color: wallet.isConnected ? "#05292e" : "#9ca3af",
                border: "none",
                borderRadius: "6px",
                fontWeight: "900",
                cursor: (loading || !wallet.isConnected) ? "not-allowed" : "pointer",
                transition: "all 0.2s ease"
              }}
            >
              Execute Protocol Bid (4.75 ETH)
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Status / Verification Alerts */}
      {error && (
        <div style={{ marginTop: "24px", padding: "12px 16px", backgroundColor: "#fef2f2", borderLeft: "4px solid #ef4444", borderRadius: "4px", color: "#b91c1c", fontSize: "13px" }}>
          <strong>Handshake Error:</strong> {error}
        </div>
      )}

      {txStatus && (
        <div style={{ marginTop: "24px", padding: "12px 16px", backgroundColor: "#f0fdf4", borderLeft: "4px solid #22c55e", borderRadius: "4px", color: "#15803d", fontSize: "13px", fontFamily: "monospace" }}>
          <strong>Status:</strong> {txStatus}
        </div>
      )}
    </div>
  );
}
