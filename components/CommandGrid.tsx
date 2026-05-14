"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Gavel, Car, Home, Globe } from "lucide-react";

interface CommandGridProps {
  onOpenSupportChat?: () => void; // 🤖 Sockets into your layout's sidebar toggle state
}

export default function CommandGrid({ onOpenSupportChat }: CommandGridProps) {
  
  const handleSupportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenSupportChat) {
      onOpenSupportChat();
    } else {
      // Friendly fallback alert if state hasn't loaded yet
      alert("AI Support Concierge Initializing... Please toggle via the sidebar drawer button.");
    }
  };

  return (
    <div id="bazaria-command-grid" style={styles.gridContainer}>
      
      {/* 🧭 PILLAR 1: EXPLORATION HUB */}
      <div style={styles.pillar}>
        <span style={styles.label}>Exploration</span>
        <div style={styles.title}>Marketplace</div>
        <div style={styles.linkGroup}>
          <Link href="/market" style={styles.link}>Global Registry</Link>
          <Link href="/market?cat=property" style={styles.link}>Property</Link>
          <Link href="/market?cat=caribbean" style={styles.link}>Caribbean Sanctuary</Link>
          <Link href="/market?cat=mobility" style={styles.link}>Mobility</Link>
        </div>
      </div>
      
      {/* 🔒 PILLAR 2: COMMAND TERMINAL */}
      <div style={styles.pillar}>
        <span style={styles.label}>Command</span>
        <div style={styles.title}>Operator</div>
        <div style={styles.linkGroup}>
          <Link href="/login" style={styles.link}>Merchant</Link>
          <Link href="/account/vault" style={styles.link}>Vault</Link>
          <Link href="/admin/licensing" style={styles.link}>Admin</Link>
          {/* 🤖 Clean, responsive React handler hooks natively into your layout sidebar states */}
          <a href="#" onClick={handleSupportClick} style={styles.link}>Support</a>
        </div>
      </div>
      
      {/* 🤝 PILLAR 3: CORPORATE BOUTIQUE */}
      <div style={styles.pillar} style={{ ...styles.pillar, borderRight: "none" }}>
        <span style={styles.label}>Partnership</span>
        <div style={styles.title}>Boutique</div>
        <div style={styles.linkGroup}>
          <Link href="/register/license" style={styles.link}>Licensing</Link>
          {/* 🏛️ Safe Routing Link pointing back to your sidebar drawer options */}
          <Link href="/market" style={styles.link}>Ecosystem Protocols</Link>
          <Link href="/listing-agent-program" style={styles.link}>Listing Agent Program</Link>
          
          <Link href="/register/agent" style={styles.ctaButton}>Apply</Link>
        </div>
      </div>

    </div>
  );
}

// 🎨 Premium Inline Style Matrix (Fully isolated from CSS collisions)
const styles = {
  gridContainer: {
    fontFamily: "system-ui, sans-serif",
    backgroundColor: "#05292e", 
    color: "#ffffff",
    padding: "20px 4% 50px 4%", 
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
    width: "100%",
    boxSizing: "border-box" as const,
    gap: "32px",
    borderTop: "1px solid rgba(255, 191, 0, 0.15)",
  },
  pillar: {
    padding: "15px 20px",
    display: "flex",
    flexDirection: "column",
    textAlign: "left" as const,
    borderRight: "1px solid rgba(255, 191, 0, 0.15)",
  },
  label: {
    fontSize: "8px",
    fontWeight: 900,
    color: "#94a3b8",
    textTransform: "uppercase" as const,
    letterSpacing: "3px",
    marginBottom: "8px",
  },
  title: {
    fontSize: "16px",
    fontWeight: 900,
    textTransform: "uppercase" as const,
    color: "#FFBF00",
    marginBottom: "20px",
    letterSpacing: "1px",
  },
  linkGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  link: {
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    transition: "all 0.2s ease",
  },
  ctaButton: {
    marginTop: "12px",
    display: "inline-block",
    border: "1px solid #FFBF00",
    color: "#FFBF00",
    padding: "10px 15px",
    borderRadius: "6px",
    fontSize: "9px",
    fontWeight: 900,
    textTransform: "uppercase" as const,
    textDecoration: "none",
    textAlign: "center" as const,
    width: "fit-content",
  }
};
