"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Terminal, ArrowLeft, Layout, Database, HardDrive, Download, FileText } from "lucide-react";

export default function SystemProtocols() {
  const router = useRouter();

  const resources = [
    { title: "Dashboard Interface Map", size: "2.1 MB", type: "PDF" },
    { title: "Bulk Upload CSV Template", size: "15 KB", type: "CSV" }
  ];

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <button onClick={() => router.back()} style={styles.backBtn}>
        <ArrowLeft size={16} /> BACK TO HANDBOOK
      </button>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.iconBox}><Terminal color="#FFBF00" /></div>
        <h1 style={styles.title}>System Protocols</h1>
        <p style={styles.subtitle}>Mastering the Bazaria Toolset and Data Synchronization.</p>
      </div>

      <div style={styles.content}>
        {/* Section 1: The Dashboard */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Layout size={20} color="#FFBF00" />
            <h2 style={styles.sectionTitle}>1. Dashboard Navigation</h2>
          </div>
          <p style={styles.text}>
            Your main Command Center is where you track active listings and client engagement. 
            Always ensure your **Agent Profile** is synchronized before initiating new business listings.
          </p>
        </div>

        {/* SECTION 2: LISTING PROTOCOL */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Database size={20} color="#FFBF00" />
            <h2 style={styles.sectionTitle}>2. Listing Protocol</h2>
          </div>
          <p style={styles.text}>
            Auctions can be launched with zero upfront platform cost for clients. System lifespans are strictly managed by asset category. Ensure listings are deployed under the correct lifecycle timeline:
          </p>
          <div style={styles.stepBox}>
            <div style={styles.step}><strong>General Items (3 Days):</strong> Standard duration for general retail, furniture, bicycles, and electronics.</div>
            <div style={styles.step}><strong>Vehicles & Heavy Equipment (7 Days):</strong> Standard duration for cars, trucks, RVs, and heavy machinery.</div>
            <div style={styles.step}><strong>Real Estate & Land (30 Days):</strong> Standard duration for properties, commercial developments, and land parcels.</div>
          </div>
          <p style={{ ...styles.text, marginTop: '16px', fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>
            * Note: If an auction concludes and the reserve price has not been met, the storefront owner can manually re-list the item or remove it completely at their discretion.
          </p>
        </div>

        {/* SECTION 3: TRANSACTION & LOGISTICS MECHANICS */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Terminal size={20} color="#FFBF00" />
            <h2 style={styles.sectionTitle}>3. Transaction & Logistics Mechanics</h2>
          </div>
          <div style={styles.protcolBox}>
            <ul style={{ color: '#cbd5e1', fontSize: '13px', paddingLeft: '20px', lineHeight: '1.7', margin: 0 }}>
              <li><strong>Processing Fees:</strong> A 3% credit card/debit card fee is automatically charged to the buyer at final check-out. Buyers are also responsible for all local sales taxes.</li>
              <li><strong>Logistics & Shipping:</strong> Call tags are available to sellers at discounted Bazaria rates. A flat $5 processing fee is applied to cover administrative costs when arranging shipping carrier pick-ups.</li>
              <li><strong>Automated Withholding:</strong> Bazaria's engine automatically withholds the flat 6% marketplace commission upon successful sale completion, splitting the cut and queueing the residual directly to your Agent pipeline.</li>
            </ul>
          </div>
        </div>

        {/* SECTION 4: DATA INTEGRITY */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <HardDrive size={20} color="#FFBF00" />
            <h2 style={styles.sectionTitle}>4. Data Integrity</h2>
          </div>
          {/* 🎯 FIXED: Merged duplicate style props here */}
          <div style={{ ...styles.protcolBox, borderLeft: "4px solid #FFBF00" }}>
            <p style={{ ...styles.text, margin: 0, fontSize: "14px", lineHeight: "1.7" }}>
              <strong>Sync & Cache Protocol:</strong> If a listing is not appearing in the marketplace, perform a <strong>Hard Refresh</strong>. Bazaria uses aggressive edge caching to keep the Living Economy ultra-fast. Manual directory syncs are sometimes required for immediate real-time rendering.
            </p>
          </div>
        </div>

        {/* Resource Vault */}
        <div style={styles.resourceSection}>
          <h3 style={styles.resourceHeader}>
            <FileText size={18} color="#FFBF00" style={{ marginRight: '10px' }} />
            TECHNICAL ASSETS
          </h3>
          <div style={styles.resourceGrid}>
            {resources.map((file, index) => (
              <div key={index} style={styles.resourceCard}>
                <div>
                  <div style={styles.fileTitle}>{file.title}</div>
                  <div style={styles.fileMeta}>{file.type} • {file.size}</div>
                </div>
                {/* 🎯 UPGRADED: Buttons changed to direct download anchors */}
                <a 
                  href={`/resources/${file.title.replace(/\s+/g, '_').toLowerCase()}.${file.type.toLowerCase()}`}
                  download
                  style={styles.downloadBtn}
                >
                  <Download size={14} />
                </a>
              </div>
            ))}
          </div>
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
  text: { color: "#cbd5e1", fontSize: "15px", lineHeight: "1.7", margin: 0 },
  stepBox: { display: "flex", flexDirection: "column" as const, gap: "12px" },
  step: { color: "#cbd5e1", fontSize: "14px", padding: "12px", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "8px" },
  protcolBox: { backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", borderLeft: "4px solid #FFBF00" },
  resourceSection: { marginTop: "20px", paddingBottom: "60px" },
  resourceHeader: { color: "#ffffff", fontSize: "14px", fontWeight: 900, letterSpacing: "1px", marginBottom: "20px", display: "flex", alignItems: "center" },
  resourceGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  resourceCard: { backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  fileTitle: { color: "#ffffff", fontSize: "13px", fontWeight: 700 },
  fileMeta: { color: "#64748b", fontSize: "11px", marginTop: "4px" },
  downloadBtn: { display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255, 191, 0, 0.1)", border: "none", borderRadius: "8px", padding: "8px", cursor: "pointer", color: "#FFBF00", textDecoration: "none" }
};
