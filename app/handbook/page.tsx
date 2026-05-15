"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  Terminal, 
  LifeBuoy, 
  TrendingUp, 
  ShieldAlert, 
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
      icon: <Terminal size={24} color="#FFBF00" />,
      description: "Master the Listing Dashboard, inventory management, and technical asset synchronization.",
      path: "/handbook/tools"
    },
    {
      id: "support",
      title: "Stewardship Ops",
      subtitle: "Customer Support",
      icon: <LifeBuoy size={24} color="#FFBF00" />,
      description: "Standard operating procedures for dispute resolution, technical glitches, and user guidance.",
      path: "/handbook/support"
    },
    {
      id: "growth",
      title: "Market Expansion",
      subtitle: "Promote & Sell",
      icon: <TrendingUp size={24} color="#FFBF00" />,
      description: "Strategic sales scripts, utilizing Stripe Paylinks, and business conversion techniques.",
      path: "/handbook/growth"
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
          Welcome, Agent. Access your operational manuals below. 
          Follow these protocols to maintain the integrity of the Living Economy.
        </p>
      </div>

      {/* The Trinity Pillars */}
      <div style={styles.grid}>
        {sections.map((section) => (
          <div 
            key={section.id} 
            style={styles.card}
            onClick={() => router.push(section.path)}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255, 191, 0, 0.5)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255, 191, 0, 0.1)")}
          >
            <div style={styles.cardHeader}>
              <div style={styles.iconBox}>{section.icon}</div>
              <div style={styles.cardTitleBox}>
                <span style={styles.pillarSubtitle}>{section.subtitle}</span>
                <h2 style={styles.pillarTitle}>{section.title}</h2>
              </div>
            </div>
            <p style={styles.cardDescription}>{section.description}</p>
            <div style={styles.cardFooter}>
              <span style={styles.actionLink}>Access Manual</span>
              <ChevronRight size={16} color="#FFBF00" />
            </div>
          </div>
        ))}
      </div>

      {/* AI Protocol Pilot Teaser */}
      <div style={styles.aiBox}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Bot size={28} color="#FFBF00" />
          <div>
            <h3 style={styles.aiTitle}>Protocol Pilot AI</h3>
            <p style={styles.aiText}>Need an instant answer? The Agent Mentor is being calibrated for your sector.</p>
          </div>
        </div>
        <button style={styles.aiButton}>Coming Soon</button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#021a1d", padding: "60px 20px", display: "flex", flexDirection: "column" as const, alignItems: "center" },
  header: { textAlign: "center" as const, maxWidth: "700px", marginBottom: "60px" },
  badge: { display: "inline-flex", alignItems: "center", backgroundColor: "rgba(255, 191, 0, 0.1)", color: "#FFBF00", padding: "6px 16px", borderRadius: "20px", fontSize: "10px", fontWeight: 900, letterSpacing: "2px", marginBottom: "20px", border: "1px solid rgba(255, 191, 0, 0.2)" },
  title: { color: "#ffffff", fontSize: "42px", fontWeight: 900, marginBottom: "16px", letterSpacing: "-1px" },
  subtitle: { color: "#94a3b8", fontSize: "16px", lineHeight: "1.6" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", width: "100%", maxWidth: "1100px", marginBottom: "60px" },
  card: { backgroundColor: "#05292e", border: "1px solid rgba(255, 191, 0, 0.1)", borderRadius: "24px", padding: "32px", cursor: "pointer", transition: "0.3s all ease", display: "flex", flexDirection: "column" as const, justifyContent: "space-between" },
  cardHeader: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" },
  iconBox: { width: "50px", height: "50px", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" },
  cardTitleBox: { display: "flex", flexDirection: "column" as const },
  pillarSubtitle: { color: "#FFBF00", fontSize: "10px", fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "1px" },
  pillarTitle: { color: "#ffffff", fontSize: "20px", fontWeight: 800, marginTop: "2px" },
  cardDescription: { color: "#cbd5e1", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" },
  cardFooter: { display: "flex", alignItems: "center", gap: "8px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "20px" },
  actionLink: { color: "#FFBF00", fontSize: "12px", fontWeight: 900, textTransform: "uppercase" as const },
  aiBox: { width: "100%", maxWidth: "1100px", backgroundColor: "rgba(255, 255, 255, 0.03)", border: "1px dashed rgba(255, 255, 255, 0.1)", borderRadius: "24px", padding: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "20px" },
  aiTitle: { color: "#ffffff", fontSize: "18px", fontWeight: 800, margin: 0 },
  aiText: { color: "#94a3b8", fontSize: "14px", margin: "4px 0 0 0" },
  aiButton: { backgroundColor: "transparent", border: "1px solid rgba(255, 255, 255, 0.2)", color: "#94a3b8", padding: "10px 20px", borderRadius: "12px", fontSize: "12px", fontWeight: 700, cursor: "not-allowed" },
};
