"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  Terminal, 
  LifeBuoy, 
  TrendingUp, 
  Users, 
  ChevronRight,
  Bot
} from "lucide-react";

export default function AgentHandbookPortal() {
  const router = useRouter();

  const sections = [
    {
      id: "tools",
      title: "System Protocols",
      subtitle: "Using Bazaria Tools",
      status: "Operational",
      icon: <Terminal size={20} color="#FFBF00" />,
      description: "Master the Listing Dashboard, inventory management, and technical asset synchronization.",
      path: "/handbook/tools"
    },
    {
      id: "growth",
      title: "Market Expansion",
      subtitle: "Promote & Sell",
      status: "Active",
      icon: <TrendingUp size={20} color="#FFBF00" />,
      description: "Strategic sales scripts, utilizing Stripe Paylinks, and business conversion techniques.",
      path: "/handbook/growth"
    },
    {
      id: "support",
      title: "Stewardship Ops",
      subtitle: "Customer Support",
      status: "Operational",
      icon: <LifeBuoy size={20} color="#FFBF00" />,
      description: "Standard operating procedures for dispute resolution and technical guidance.",
      path: "/handbook/support"
    },
    {
      id: "network",
      title: "Expansion Protocol",
      subtitle: "Recruit & Scale",
      status: "Under Calibration",
      icon: <Users size={20} color="#FFBF00" />,
      description: "The official framework for recruiting new agents and building your sub-network.",
      path: "/handbook/network"
    }
  ];

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.badge}>
          <BookOpen size={14} color="#FFBF00" style={{ marginRight: '8px' }} />
          OPERATIONAL PROTOCOLS
        </div>
        <h1 style={styles.title}>Agent Handbook</h1>
        <p style={styles.subtitle}>
          Access your operational manuals. Follow these protocols to maintain the integrity of the Living Economy.
        </p>
      </div>

      {/* 2x2 Square Grid */}
      <div style={styles.grid}>
        {sections.map((section) => (
          <div 
            key={section.id} 
            style={styles.card}
            onClick={() => router.push(section.path)}
          >
            <div style={styles.cardHeader}>
              <div style={styles.iconBox}>{section.icon}</div>
              <div style={styles.statusBadge}>{section.status}</div>
            </div>
            
            <div style={styles.cardBody}>
              <span style={styles.pillarSubtitle}>{section.subtitle}</span>
              <h2 style={styles.pillarTitle}>{section.title}</h2>
              <p style={styles.cardDescription}>{section.description}</p>
            </div>

            <div style={styles.cardFooter}>
              <span style={styles.actionLink}>Open Manual</span>
              <ChevronRight size={14} color="#FFBF00" />
            </div>
          </div>
        ))}
      </div>

      {/* AI Bot Footer */}
      <div style={styles.aiBox}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={styles.aiIconBox}><Bot size={22} color="#FFBF00" /></div>
          <div>
            <h3 style={styles.aiTitle}>Protocol Pilot AI</h3>
            <p style={styles.aiText}>Neural guidance systems currently being calibrated for field deployment.</p>
          </div>
        </div>
        <div style={styles.aiStatus}>OFFLINE</div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#021a1d", padding: "80px 20px", display: "flex", flexDirection: "column" as const, alignItems: "center" },
  header: { textAlign: "center" as const, maxWidth: "600px", marginBottom: "60px" },
  badge: { display: "inline-flex", alignItems: "center", backgroundColor: "rgba(255, 191, 0, 0.05)", color: "#FFBF00", padding: "8px 20px", borderRadius: "30px", fontSize: "10px", fontWeight: 900, letterSpacing: "2px", marginBottom: "24px", border: "1px solid rgba(255, 191, 0, 0.2)" },
  title: { color: "#ffffff", fontSize: "42px", fontWeight: 900, marginBottom: "16px", letterSpacing: "-1px" },
  subtitle: { color: "#94a3b8", fontSize: "15px", lineHeight: "1.6" },
  
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(2, 400px)", // 🎯 Perfect fixed 2x2 square
    justifyContent: "center",
    gap: "20px", 
    width: "100%", 
    marginBottom: "60px" 
  },

  card: { backgroundColor: "#05292e", border: "1px solid rgba(255, 191, 0, 0.1)", borderRadius: "24px", padding: "32px", cursor: "pointer", transition: "0.2s ease", display: "flex", flexDirection: "column" as const, justifyContent: "space-between" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" },
  iconBox: { width: "44px", height: "44px", backgroundColor: "rgba(255, 255, 255, 0.03)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255, 255, 255, 0.05)" },
  statusBadge: { fontSize: "8px", fontWeight: 900, color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase" as const, letterSpacing: "1px", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "4px 8px", borderRadius: "4px" },
  cardBody: { marginBottom: "24px" },
  pillarSubtitle: { color: "#FFBF00", fontSize: "9px", fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "1.5px" },
  pillarTitle: { color: "#ffffff", fontSize: "20px", fontWeight: 800, marginTop: "4px" },
  cardDescription: { color: "#64748b", fontSize: "13px", lineHeight: "1.6", marginTop: "12px" },
  cardFooter: { display: "flex", alignItems: "center", gap: "6px", paddingTop: "20px", borderTop: "1px solid rgba(255, 255, 255, 0.05)" },
  actionLink: { color: "#FFBF00", fontSize: "10px", fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "1px" },
  
  aiBox: { width: "100%", maxWidth: "820px", backgroundColor: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "20px", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  aiIconBox: { width: "40px", height: "40px", borderRadius: "50%", border: "1px solid rgba(255, 191, 0, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" },
  aiTitle: { color: "#ffffff", fontSize: "15px", fontWeight: 800, margin: 0 },
  aiText: { color: "#64748b", fontSize: "12px", margin: "2px 0 0 0" },
  aiStatus: { color: "#ef4444", fontSize: "9px", fontWeight: 900, letterSpacing: "2px", opacity: 0.6 }
};
