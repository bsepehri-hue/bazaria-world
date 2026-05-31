"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, Briefcase, Calendar, Wallet, Trophy, Eye } from "lucide-react";
import { UserProfile } from "@/lib/profile"; // 👈 Your data types imported here
import ProfileForm from "@/components/profile/ProfileForm";
import { ActivityList } from "@/components/profile/RecentActivityList";
import { shortenAddress } from "@/lib/utils";

import { db } from "@/lib/firebase/client";
// 🛰️ ADDED 'collectionGroup' to enable cross-subcollection telemetry tracking
import { collection, query, where, limit, getDocs, collectionGroup } from "firebase/firestore";
import { FiTarget } from "react-icons/fi";

export default function ProfileClient({
  profile,
}: {
  profile: UserProfile;
}) {
  const [activities, setActivities] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("general");

  // 🛰️ Native URL query tracker (Forces updates without depending on router caching)
  useEffect(() => {
    const parseUrlTab = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const urlTab = params.get("tab") || "general";
        setActiveTab(urlTab);
      }
    };

    parseUrlTab();
    window.addEventListener("popstate", parseUrlTab);
    const intervalCheck = setInterval(parseUrlTab, 200);

    return () => {
      window.removeEventListener("popstate", parseUrlTab);
      clearInterval(intervalCheck);
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!profile?.id) return;

      const q = query(
        collection(db, "activity"),
        where("userId", "==", profile.id),
        limit(20)
      );

      try {
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setActivities(data);
      } catch (err) {
        console.error("Firestore error:", err);
      }
    };

    load();
  }, [profile?.id]);

  return (
    <div style={styles.dashboardContainer}>
      {/* LEFT/CENTER MAIN PANELS */}
      <div style={styles.mainContentColumn}>
        
        {/* 📋 Profile Header Panel using self-contained inline styling attributes */}
        <div style={styles.profileHeaderCard}>
          <div style={styles.headerFlexRow}>
            <div style={styles.avatarCircle}>
              {profile.displayName ? profile.displayName.charAt(0) : "U"}
            </div>
            <div>
              <h1 style={styles.profileNameTitle}>{profile.displayName}</h1>
              <p style={styles.walletAddressSubtitle}>
                {profile.walletAddress ? shortenAddress(profile.walletAddress, 8) : "No wallet connected"}
              </p>
            </div>
          </div>

          <p style={styles.bioText}>
            "{profile.bio || "Welcome to Bazaria!"}"
          </p>

          <div style={styles.metaDataGrid}>
            <div style={styles.metaItem}>
              <Wallet style={styles.iconTealInline} size={16} />
              <span style={{ fontFamily: "monospace" }}>
                {profile.walletAddress ? shortenAddress(profile.walletAddress, 4) : "No wallet"}
              </span>
            </div>

            <div style={styles.metaItem}>
              <Calendar style={styles.iconTealInline} size={16} />
              <span>Joined: {profile.joinDate ? profile.joinDate.toLocaleDateString() : "Recent"}</span>
            </div>

            <div style={styles.metaItem}>
              <Briefcase style={styles.iconTealInline} size={16} />
              <span>Storefront: </span>
              {profile.storefrontId ? (
                <Link href={`/dashboard`} style={styles.inlineLink}>
                  View Store #{profile.storefrontId}
                </Link>
              ) : (
                <span style={{ color: "#ef4444", fontWeight: "600" }}>None Linked</span>
              )}
            </div>

            <div style={styles.metaItem}>
              <Shield style={styles.iconTealInline} size={16} />
              <span>2FA Status: </span>
              <span style={{ fontWeight: "600", color: profile.twoFactorEnabled ? "#16a34a" : "#ef4444" }}>
                {profile.twoFactorEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>

        {/* 📊 TAB SECTION ROUTING LOGIC */}
        {activeTab === "general" && (
          <div style={styles.tabContainer}>
            <ProfileForm profile={profile} />

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>
                <Shield style={styles.iconTeal} size={20} /> Security & Preferences
              </h3>
              <p style={styles.cardText}>
                Placeholder for toggling email notifications, connecting dynamic social accounts, or enabling 2FA.
              </p>
            </div>
          </div>
        )}

        {/* 📈 POLISHED TAB PANEL: ACTIVE MARKETPLACE BIDS */}
        {activeTab === "bids" && (
          <div style={styles.card}>
            <h3 style={{ ...styles.cardTitle, borderBottom: "1px solid #e5e7eb", paddingBottom: "12px" }}>
              <Trophy style={styles.iconGold} size={20} /> Active Marketplace Bids
            </h3>
            
            {/* 🏎️ HIGH-FIDELITY LIVE telemetry ELEMENT CARD */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px", backgroundColor: "#ffffff", borderRadius: "10px",
              border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", marginTop: "4px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {/* Fallback Asset Thumbnail Frame */}
                <div style={{ width: "56px", height: "56px", borderRadius: "8px", backgroundColor: "#f1f5f9", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img 
                    src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=200" 
                    alt="Ducati Panigale V4 S" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                </div>
                
                <div>
                  <h5 style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>2024 Ducati Panigale V4 S</h5>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                    Your Allocated Bid: <strong style={{ color: "#0f172a" }}>$31,500</strong> • Current High: <strong style={{ color: "#ef4444" }}>$32,000</strong>
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                {/* 🚨 DYNAMIC RADAR OUTBID SIGNAL BADGE */}
                <span style={{
                  fontSize: "10px", fontWeight: 900, letterSpacing: "0.05em",
                  backgroundColor: "#fef2f2", color: "#ef4444", border: "1px solid #fee2e2",
                  padding: "4px 8px", borderRadius: "4px"
                }}>
                  🚨 OUTBID
                </span>
                
                <Link 
                  href="/radar/ducati-v4s-example-xid" 
                  style={{
                    fontSize: "11px", fontWeight: "bold", color: "#ffffff", backgroundColor: "#ff4d4d",
                    textDecoration: "none", padding: "6px 12px", borderRadius: "4px", boxShadow: "0 2px 4px rgba(255,77,77,0.2)",
                    textAlign: "center"
                  }}
                >
                  Counter Strike ⚡
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 📦 POLISHED TAB PANEL: LIVE WATCHLIST & ONBOARDING */}
        {activeTab === "listings" && (
          <div style={styles.card}>
            <h3 style={{ ...styles.cardTitle, borderBottom: "1px solid #e5e7eb", paddingBottom: "12px" }}>
              <Eye style={styles.iconTeal} size={20} /> Live Watchlist & Saved Items
            </h3>
            
            {/* 🧭 PREMIUM COMPACT EMPTY WATCHLIST ONBOARDING TUNNEL */}
            <div style={{
              padding: "40px 20px", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", textAlign: "center",
              backgroundColor: "#fafafa", borderRadius: "12px", border: "1px dashed #e2e8f0",
              marginTop: "4px"
            }}>
              <FiTarget size={36} color="#94a3b8" style={{ strokeWidth: 1.5, marginBottom: "12px", opacity: 0.7 }} />
              
              <h5 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#334155" }}>
                Your Bidding Radar is Clear
              </h5>
              <p style={{ margin: "4px 0 16px 0", fontSize: "12px", color: "#64748b", maxWidth: "280px", lineHeight: "1.5" }}>
                Track active listings, premium assets, and real-time counter-strikes by flagging items across the market registry.
              </p>
              
              <Link 
                href="/market"
                style={{
                  backgroundColor: "transparent", color: "#004d40", border: "1px solid #004d40",
                  padding: "8px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold",
                  textDecoration: "none", transition: "all 0.15s ease"
                }}
              >
                Explore Live Auctions →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR PANEL */}
      <div style={styles.sidebarColumn}>
        <ActivityList activities={activities} />
      </div>
    </div>
  );
}

// 🎨 CORE INLINE STYLES CONFIGURATION BLOCK AT THE BOTTOM
const styles = {
  dashboardContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "32px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "16px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  mainContentColumn: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
    width: "100%",
  },
  sidebarColumn: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #f3f4f6",
    padding: "24px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  tabContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #f3f4f6",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    padding: "24px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  profileHeaderCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #f3f4f6",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
    padding: "32px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
  },
  headerFlexRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    borderBottom: "1px solid #f3f4f6",
    paddingBottom: "16px",
  },
  avatarCircle: {
    width: "64px",
    height: "64px",
    backgroundColor: "#014d4e",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  profileNameTitle: {
    fontSize: "28px",
    fontWeight: "800" as const,
    color: "#111827",
    margin: 0,
  },
  walletAddressSubtitle: {
    fontSize: "14px",
    fontFamily: "monospace",
    color: "#6b7280",
    margin: "4px 0 0 0",
  },
  bioText: {
    fontSize: "16px",
    color: "#374151",
    fontStyle: "italic" as const,
    borderLeft: "4px solid #014d4e",
    paddingLeft: "16px",
    margin: 0,
  },
  metaDataGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #f3f4f6",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    color: "#4b5563",
    gap: "8px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700" as const,
    color: "#111827",
    display: "flex",
    alignItems: "center",
    margin: 0,
  },
  cardText: {
    fontSize: "14px",
    color: "#4b5563",
    lineHeight: "1.5",
    margin: 0,
  },
  inlineLink: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600" as const,
  },
  iconTeal: {
    marginRight: "8px",
    color: "#014d4e",
  },
  iconTealInline: {
    color: "#014d4e",
  },
  iconGold: {
    marginRight: "8px",
    color: "#d97706",
  },
};
