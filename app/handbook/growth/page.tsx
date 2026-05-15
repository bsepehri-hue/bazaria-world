"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, ArrowLeft, Link as LinkIcon, MessageSquare, DollarSign } from "lucide-react";

export default function MarketExpansionProtocol() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <button onClick={() => router.back()} style={styles.backBtn}>
        <ArrowLeft size={16} /> BACK TO HANDBOOK
      </button>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.iconBox}><TrendingUp color="#FFBF00" /></div>
        <h1 style={styles.title}>Market Expansion</h1>
        <p style={styles.subtitle}>Protocol for converting businesses and selling Ad Credits.</p>
      </div>

      <div style={styles.content}>
        {/* Section 1: The Pitch */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <MessageSquare size={20} color="#FFBF00" />
            <h2 style={styles.sectionTitle}>1. The 30-Second Pitch</h2>
          </div>
          <div style={styles.protcolBox}>
            <p style={styles.text}>
              "Bazaria isn't just a marketplace; it's a **Living Economy**. We don't just list your items—we connect them to a network of active Stewards who promote your inventory for you. You only pay for the visibility you want."
            </p>
          </div>
        </div>

        {/* Section 2: The Stripe Protocol */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <DollarSign size={20} color="#FFBF00" />
            <h2 style={styles.sectionTitle}>2. Payment Protocol (Stripe)</h2>
          </div>
          <ul style={styles.list}>
            <li style={styles.listItem}><strong>Step 1:</strong> Calculate the total cost of Ad Credits with the client.</li>
            <li style={styles.listItem}><strong>Step 2:</strong> Use the official Bazaria Stripe Paylink.</li>
            <li style={styles.listItem}><strong>Step 3:</strong> Ensure you enter your <strong>Agent Code</strong> in the reference field so you get credited.</li>
            <li style={styles.listItem}><strong>Step 4:</strong> Once the client pays, Stripe handles the receipt. You are done.</li>
          </ul>
        </div>

        {/* Section 3: Handling Objections */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <LinkIcon size={20} color="#FFBF00" />
            <h2 style={styles.sectionTitle}>3. Why Bazaria? (Handling Objections)</h2>
          </div>
          <div style={styles.grid}>
            <div style={styles.miniCard}>
              <h4 style={styles.miniTitle}>"I already use Facebook"</h4>
              <p style={styles.miniText}>Facebook is a feed; Bazaria is a network. We have human agents, not just algorithms.</p>
            </div>
            <div style={styles.miniCard}>
              <h4 style={styles.miniTitle}>"Is it expensive?"</h4>
              <p style={styles.miniText}>It costs nothing to list. You only spend money on Ad Credits when you want to boost sales.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#021a1d", padding: "60px 20px", display: "flex", flexDirection: "column" as const, alignItems: "center" },
  backBtn: { alignSelf: 'flex-start', backgroundColor: 'transparent', border: 'none', color: '#64748b', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', maxWidth: '1000px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
  header: { textAlign: "center" as const, marginBottom: "50px" },
  iconBox: { width: "60px", height: "60px", backgroundColor: "rgba(255, 191, 0, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto" },
  title: { color: "#ffffff", fontSize: "32px", fontWeight: 900, marginBottom: "10px" },
  subtitle: { color: "#94a3b8", fontSize: "14px" },
  content: { width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column" as const, gap: "40px" },
  section: { backgroundColor: "#05292e", padding: "32px", borderRadius: "24px", border: "1px solid rgba(255, 255, 255, 0.05)" },
  sectionHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" },
  sectionTitle: { color: "#FFBF00", fontSize: "18px", fontWeight: 800, margin: 0 },
  protcolBox: { backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", borderLeft: "4px solid #FFBF00" },
  text: { color: "#cbd5e1", fontSize: "15px", lineHeight: "1.7", margin: 0 },
  list: { paddingLeft: "20px", color: "#cbd5e1" },
  listItem: { marginBottom: "12px", fontSize: "14px", lineHeight: "1.5" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "10px" },
  miniCard: { backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "16px" },
  miniTitle: { color: "#ffffff", fontSize: "14px", fontWeight: 700, marginBottom: "8px" },
  miniText: { color: "#64748b", fontSize: "12px", lineHeight: "1.5", margin: 0 }
};
