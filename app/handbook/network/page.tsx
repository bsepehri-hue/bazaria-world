"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Users, ArrowLeft, UserPlus, ShieldCheck, FileText, Download } from "lucide-react";

export default function ExpansionProtocol() {
  const router = useRouter();

  // Mock data for the PDF library
  const resources = [
    { title: "Agent Onboarding Guide", size: "1.2 MB", type: "PDF" },
    { title: "Network Growth Strategy", size: "850 KB", type: "PDF" },
    { title: "Brand Identity Assets", size: "4.5 MB", type: "ZIP" }
  ];

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <button onClick={() => router.back()} style={styles.backBtn}>
        <ArrowLeft size={16} /> BACK TO HANDBOOK
      </button>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.iconBox}><Users color="#FFBF00" /></div>
        <h1 style={styles.title}>Expansion Protocol</h1>
        <p style={styles.subtitle}>Framework for recruiting Agents and scaling the Bazaria Network.</p>
      </div>

      <div style={styles.content}>
        {/* Section 1: The Vision */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <UserPlus size={20} color="#FFBF00" />
            <h2 style={styles.sectionTitle}>1. Strategic Recruitment</h2>
          </div>
          <p style={styles.text}>
            We don't just hire; we **deputize**. When looking for new Agents, focus on individuals who understand 
            community value and asset management. Look for local leaders, small business advocates, and tech-forward individuals.
          </p>
        </div>

        {/* Section 2: Onboarding Steps */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <ShieldCheck size={20} color="#FFBF00" />
            <h2 style={styles.sectionTitle}>2. Onboarding Protocol</h2>
          </div>
          <div style={styles.stepBox}>
            <div style={styles.step}><strong>01. Vetting:</strong> Ensure they align with Bazaria's core principles.</div>
            <div style={styles.step}><strong>02. Enrollment:</strong> Guide them to the Partner Registry portal.</div>
            <div style={styles.step}><strong>03. Training:</strong> Direct them to this Handbook immediately.</div>
          </div>
        </div>

        {/* PLACE THIS INSIDE THE SECTIONS ARRAY OR CONTENT WRAPPER IN NETWORK/PAGE.TSX */}
<div style={styles.section}>
  <div style={styles.sectionHeader}>
    <CreditCard size={20} color="#FFBF00" />
    <h2 style={styles.sectionTitle}>3. Steward Auto-Loader Debit Cards</h2>
  </div>
  <p style={styles.text}>
    Bazaria tracks all sales and infrastructure commissions automatically within your dashboard container. 
  </p>
  <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #FFBF00' }}>
    <h4 style={{ color: '#ffffff', fontSize: '14px', margin: '0 0 8px 0', fontWeight: 800 }}>The $500 Milestone Pipeline:</h4>
    <ul style={{ color: '#cbd5e1', fontSize: '13px', paddingLeft: '20px', lineHeight: '1.6' }}>
      <li><strong>Initial Milestone:</strong> Once your accumulated tracked commission balances reach <strong>$500</strong>, a physical Bazaria Auto-Loader Debit Card is systematically generated and mailed to your verified address.</li>
      <li><strong>Flexible Withdrawals:</strong> Upon receipt, agents can initiate real-time contract credits directly onto the card at every sequential $500 milestone mark to draw out their earnings smoothly.</li>
    </ul>
  </div>
</div>

        {/* --- THE PDF RESOURCE LIBRARY --- */}
        <div style={styles.resourceSection}>
          <h3 style={styles.resourceHeader}>
            <FileText size={18} color="#FFBF00" style={{ marginRight: '10px' }} />
            RESOURCE VAULT
          </h3>
          <div style={styles.resourceGrid}>
            {resources.map((file, index) => (
              <div key={index} style={styles.resourceCard}>
                <div>
                  <div style={styles.fileTitle}>{file.title}</div>
                  <div style={styles.fileMeta}>{file.type} • {file.size}</div>
                </div>
                <button style={styles.downloadBtn}>
                  <Download size={14} />
                </button>
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
  
  // Resource Library Styles
  resourceSection: { marginTop: "20px", paddingBottom: "60px" },
  resourceHeader: { color: "#ffffff", fontSize: "14px", fontWeight: 900, letterSpacing: "1px", marginBottom: "20px", display: "flex", alignItems: "center" },
  resourceGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  resourceCard: { backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  fileTitle: { color: "#ffffff", fontSize: "13px", fontWeight: 700 },
  fileMeta: { color: "#64748b", fontSize: "11px", marginTop: "4px" },
  downloadBtn: { backgroundColor: "rgba(255, 191, 0, 0.1)", border: "none", borderRadius: "8px", padding: "8px", cursor: "pointer", color: "#FFBF00" }
};
