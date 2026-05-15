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

        {/* Section 2: Listing Protocol */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Database size={20} color="#FFBF00" />
            <h2 style={styles.sectionTitle}>2. Inventory Management</h2>
          </div>
          <div style={styles.stepBox}>
            <div style={styles.step}><strong>Validation:</strong> Verify all images meet the high-res Bazaria standard.</div>
            <div style={styles.step}><strong>Categorization:</strong> Align items with the correct Industry Category (Real Estate, Auto, etc.).</div>
            <div style={styles.step}><strong>Deployment:</strong> Use the "Push to Market" action to make listings live.</div>
          </div>
        </div>

        {/* Section 3: Data Integrity */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <HardDrive size={20} color="#FFBF00" />
            <h2 style={styles.sectionTitle}>3. Sync & Cache Protocol</h2>
          </div>
          <div style={styles.protcolBox}>
            <p style={styles.text}>
              If a listing is not appearing, perform a **Hard Refresh**. Bazaria uses aggressive caching to keep the "Living Economy" fast; manual syncs are sometimes required for real-time updates.
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
                <button style={styles.downloadBtn}><Download size={14} /></button>
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
  downloadBtn: { backgroundColor: "rgba(255, 191, 0, 0.1)", border: "none", borderRadius: "8px", padding: "8px", cursor: "pointer", color: "#FFBF00" }
};
