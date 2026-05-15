"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LifeBuoy, ArrowLeft, ShieldAlert, Zap, MessageSquare, Download, FileText } from "lucide-react";

export default function StewardshipOps() {
  const router = useRouter();

  const resources = [
    { title: "Dispute Resolution Script", size: "450 KB", type: "PDF" },
    { title: "Incident Report Template", size: "120 KB", type: "DOCX" }
  ];

  return (
    <div style={styles.container}>
      <button onClick={() => router.back()} style={styles.backBtn}>
        <ArrowLeft size={16} /> BACK TO HANDBOOK
      </button>

      <div style={styles.header}>
        <div style={styles.iconBox}><LifeBuoy color="#FFBF00" /></div>
        <h1 style={styles.title}>Stewardship Ops</h1>
        <p style={styles.subtitle}>Standard Operating Procedures for Support and Dispute Resolution.</p>
      </div>

      <div style={styles.content}>
        {/* Section 1: The Escalation Ladder */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <ShieldAlert size={20} color="#FFBF00" />
            <h2 style={styles.sectionTitle}>1. The Escalation Ladder</h2>
          </div>
          <div style={styles.grid}>
            <div style={styles.priorityCard}>
              <div style={{ ...styles.level, color: '#4ade80' }}>Level 01: Agent Handled</div>
              <p style={styles.miniText}>Basic UI questions, listing edits, and general "How-to" inquiries. Handle these locally.</p>
            </div>
            <div style={styles.priorityCard}>
              <div style={{ ...styles.level, color: '#f87171' }}>Level 02: System Support</div>
              <p style={styles.miniText}>Payment failures, bug reports, or account lockouts. Escalate via the Support Ticket System.</p>
            </div>
          </div>
        </div>

        {/* Section 2: Crisis Protocol */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Zap size={20} color="#FFBF00" />
            <h2 style={styles.sectionTitle}>2. Conflict Resolution</h2>
          </div>
          <div style={styles.protcolBox}>
            <p style={styles.text}>
              <strong>Rule of Stewardship:</strong> Always remain neutral. If a client is unhappy with an ad's performance, review their "Optimization Protocol" before escalating to a refund request.
            </p>
          </div>
        </div>

        {/* Resource Vault */}
        <div style={styles.resourceSection}>
          <h3 style={styles.resourceHeader}>
            <FileText size={18} color="#FFBF00" style={{ marginRight: '10px' }} />
            SUPPORT ASSETS
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
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  priorityCard: { backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" },
  level: { fontSize: "10px", fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: "8px" },
  miniText: { color: "#cbd5e1", fontSize: "12px", lineHeight: "1.5", margin: 0 },
  protcolBox: { backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", borderLeft: "4px solid #FFBF00" },
  text: { color: "#cbd5e1", fontSize: "14px", lineHeight: "1.7", margin: 0 },
  resourceSection: { marginTop: "20px", paddingBottom: "60px" },
  resourceHeader: { color: "#ffffff", fontSize: "14px", fontWeight: 900, letterSpacing: "1px", marginBottom: "20px", display: "flex", alignItems: "center" },
  resourceGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  resourceCard: { backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  fileTitle: { color: "#ffffff", fontSize: "13px", fontWeight: 700 },
  fileMeta: { color: "#64748b", fontSize: "11px", marginTop: "4px" },
  downloadBtn: { backgroundColor: "rgba(255, 191, 0, 0.1)", border: "none", borderRadius: "8px", padding: "8px", cursor: "pointer", color: "#FFBF00" }
};
