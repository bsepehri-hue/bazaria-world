"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, ArrowLeft, Percent, Landmark, HelpCircle, Briefcase } from "lucide-react";

export default function MarketExpansionProtocol() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <button onClick={() => router.back()} style={styles.backBtn}>
        <ArrowLeft size={16} /> BACK TO HANDBOOK
      </button>

      <div style={styles.header}>
        <div style={styles.iconBox}><TrendingUp color="#FFBF00" /></div>
        <h1 style={styles.title}>Market Expansion</h1>
        <p style={styles.subtitle}>Protocol for pitching businesses, structural commissions, and ad-hoc listing fees.</p>
      </div>

      <div style={styles.content}>
        
        {/* SECTION 1: THE CORE PITCHES */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Briefcase size={20} color="#FFBF00" />
            <h2 style={styles.sectionTitle}>1. Target Audiences & Pitches</h2>
          </div>
          <div style={styles.pitchGrid}>
            <div style={styles.miniCard}>
              <h4 style={styles.miniTitle}>The 6% Zero-Risk Pivot</h4>
              <p style={styles.miniText}>
                Pitch to traditional brick-and-mortar storefronts. Some have up to 30% overhead. Offer them a 6% flat commission on completed sales with **zero upfront cost**. If they don't sell, they don't pay a penny.
              </p>
            </div>
            <div style={styles.miniCard}>
              <h4 style={styles.miniTitle}>The Dual-Exposure Advantage</h4>
              <p style={styles.miniText}>
                For businesses with or without a website: Once they list products on their custom Bazaria Storefront, those items automatically feed directly into our global Marketplace, exposing them to the general public instantly.
              </p>
            </div>
            <div style={styles.miniCard}>
              <h4 style={styles.miniTitle}>The Solo Entrepreneur</h4>
              <p style={styles.miniText}>
                Skip the hassle of building an e-commerce site. They can launch a permanent or short-term auction storefront (e.g., a weekend corporate event or silent auction) in minutes.
              </p>
            </div>
            <div style={styles.miniCard}>
              <h4 style={styles.miniTitle}>The Local Scout Pitch</h4>
              <p style={styles.miniText}>
                Spotting unneeded items or garage inventory? Tell the owner you will act as their digital agent to monetize their idle assets through the Bazaria network.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: THE MATHEMATICAL BLUEPRINT */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Percent size={20} color="#FFBF00" />
            <h2 style={styles.sectionTitle}>2. Commission Splits & Reserve Overage</h2>
          </div>
          <p style={styles.text}>
            Bazaria charges a <strong>6% flat fee</strong> on completed sales, which is split 50/50 with you (the Listing Agent gets 3%). If an item breaks past its reserve price, an optimized performance fee applies:
          </p>
          <div style={styles.formulaBox}>
            <span style={styles.formulaTitle}>📊 CASE STUDY: Reserve Overage Split</span>
            <p style={styles.text}>An asset is listed with a <strong>$100 Reserve Price</strong> but sells for <strong>$120</strong>:</p>
            <ul style={styles.formulaList}>
              <li><strong>Reserve Amount ($100):</strong> Charged at the standard 6% ($6.00). Agent gets 3% ($3.00).</li>
              <li><strong>Overage Amount ($20):</strong> Charged at an optimized 15% ($3.00). Agent gets 7.5% ($1.50).</li>
              <li><strong>Total Agent Payoff:</strong> $4.50 directly to your account.</li>
            </ul>
          </div>
        </div>

        {/* SECTION 3: FLAT LSTING FEES */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Landmark size={20} color="#FFBF00" />
            <h2 style={styles.sectionTitle}>3. Marketplace Flat Listing Fees</h2>
          </div>
          <p style={styles.text}> For high-velocity commercial sectors requiring direct insertion into the global marketplace, apply these flat rates:</p>
          <div style={styles.table}>
            <div style={styles.tableRow}><span style={styles.tableLabel}>Car & Motorcycle Dealers</span><span style={styles.tableValue}>$10.00 / list</span></div>
            <div style={styles.tableRow}><span style={styles.tableLabel}>Trucks, RVs & Heavy Machinery</span><span style={styles.tableValue}>$25.00 / list</span></div>
            <div style={styles.tableRow}><span style={styles.tableLabel}>Properties & Land Development</span><span style={styles.tableValue}>$35.00 / list</span></div>
            <div style={styles.tableRow}><span style={styles.tableLabel}>General Bulk Items (Furniture, Bikes, Electronics)</span><span style={styles.tableValue}>$5.00 / list</span></div>
          </div>
          <p style={styles.disclaimerText}>Note: The one-time $95 auction setup fee and standard product sales directly covered by admin overhead do not generate agent residuals. Agent payouts are strictly fueled by active marketplace transaction fees.</p>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#021a1d", padding: "60px 20px", display: "flex", flexDirection: "column" as const, alignItems: "center" },
  backBtn: { alignSelf: 'flex-start', backgroundColor: 'transparent', border: 'none', color: '#64748b', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
  header: { textAlign: "center" as const, marginBottom: "50px" },
  iconBox: { width: "60px", height: "60px", backgroundColor: "rgba(255, 191, 0, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto" },
  title: { color: "#ffffff", fontSize: "32px", fontWeight: 900, marginBottom: "10px" },
  subtitle: { color: "#94a3b8", fontSize: "14px" },
  content: { width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column" as const, gap: "32px" },
  section: { backgroundColor: "#05292e", padding: "32px", borderRadius: "24px", border: "1px solid rgba(255, 255, 255, 0.05)" },
  sectionHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" },
  sectionTitle: { color: "#FFBF00", fontSize: "18px", fontWeight: 800, margin: 0 },
  text: { color: "#cbd5e1", fontSize: "14px", lineHeight: "1.7", marginBottom: "16px" },
  
  pitchGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  miniCard: { backgroundColor: "rgba(255, 255, 255, 0.02)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" },
  miniTitle: { color: "#ffffff", fontSize: "14px", fontWeight: 800, marginBottom: "8px" },
  miniText: { color: "#94a3b8", fontSize: "12px", lineHeight: "1.6", margin: 0 },

  formulaBox: { backgroundColor: "rgba(255, 191, 0, 0.03)", padding: "24px", borderRadius: "16px", border: "1px dashed rgba(255, 191, 0, 0.2)" },
  formulaTitle: { color: "#FFBF00", fontSize: "13px", fontWeight: 900, display: "block", marginBottom: "12px" },
  formulaList: { color: "#cbd5e1", fontSize: "13px", paddingLeft: "20px", lineHeight: "1.8" },

  table: { display: "flex", flexDirection: "column" as const, gap: "1px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "12px", overflow: "hidden" },
  tableRow: { display: "flex", justifyContent: "space-between", padding: "14px 20px", backgroundColor: "#05292e" },
  tableLabel: { color: "#cbd5e1", fontSize: "13px", fontWeight: 500 },
  tableValue: { color: "#FFBF00", fontSize: "13px", fontWeight: 800 },
  disclaimerText: { color: "#64748b", fontSize: "11px", lineHeight: "1.5", marginTop: "16px", fontStyle: "italic" }
};
