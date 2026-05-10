"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { db } from "@/lib/firebase/client"; 
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import { 
  FaUsers, 
  FaShoppingBag, 
  FaEnvelopeOpen, 
  FaShieldAlt, 
  FaCheckCircle, 
  FaExclamationTriangle 
} from "react-icons/fa";

interface DashboardStats {
  totalUsers: number;
  totalListings: number;
  totalChats: number;
}

interface ListingItem {
  id: string;
  title: string;
  price: number;
  userId: string;
  status?: string;
}

export default function AdminConsole() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(true); // Forced true for testing
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState<DashboardStats>({ totalUsers: 0, totalListings: 0, totalChats: 0 });
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "listings">("overview");

  useEffect(() => {
    // We let you straight into the dashboard
    setLoading(false);
  }, [user]);

  // Fetch live stats and listings
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const listingsSnap = await getDocs(collection(db, "listings"));
        const chatsSnap = await getDocs(collection(db, "chats"));

        setStats({
          totalUsers: usersSnap.size,
          totalListings: listingsSnap.size,
          totalChats: chatsSnap.size
        });

        const loadedListings = listingsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ListingItem[];
        
        setListings(loadedListings);
      } catch (err) {
        console.error("Error loading admin stats:", err);
      }
    };

    fetchAdminData();
  }, []);

  const handleUpdateStatus = async (listingId: string, newStatus: string) => {
    try {
      const docRef = doc(db, "listings", listingId);
      await updateDoc(docRef, { status: newStatus });
      
      setListings(prev => 
        prev.map(item => item.id === listingId ? { ...item, status: newStatus } : item)
      );
    } catch (err) {
      console.error("Failed to update listing status:", err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc" }}>
        <div style={{ fontSize: "18px", fontWeight: "bold", color: "#05292e" }}>Loading Admin Protocol...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", paddingBottom: "48px", fontFamily: "sans-serif" }}>
      
      {/* 👑 PREMIUM GOLD & DARK TEAL HEADER */}
      <header style={{ 
        backgroundColor: "#05292e", 
        color: "white", 
        padding: "40px 32px", 
        borderBottom: "4px solid #FFBF00",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", display: "flex", justifyContent: "between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <span style={{ color: "#FFBF00", fontSize: "11px", fontWeight: 900, letterSpacing: "3px", uppercase: "true", display: "block", marginBottom: "6px" }}>
              INTERNAL SYSTEM PROTOCOL
            </span>
            <h1 style={{ fontSize: "32px", fontWeight: 900, margin: 0, letterSpacing: "-1px" }}>
              ADMIN CONTROL ROOM
            </h1>
          </div>
          
          {/* Navigation Tabs */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              onClick={() => setActiveTab("overview")}
              style={{
                padding: "10px 20px",
                borderRadius: "20px",
                border: "none",
                fontWeight: "bold",
                fontSize: "14px",
                cursor: "pointer",
                backgroundColor: activeTab === "overview" ? "#FFBF00" : "rgba(255,255,255,0.1)",
                color: activeTab === "overview" ? "#05292e" : "white",
                transition: "all 0.2s"
              }}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("listings")}
              style={{
                padding: "10px 20px",
                borderRadius: "20px",
                border: "none",
                fontWeight: "bold",
                fontSize: "14px",
                cursor: "pointer",
                backgroundColor: activeTab === "listings" ? "#FFBF00" : "rgba(255,255,255,0.1)",
                color: activeTab === "listings" ? "#05292e" : "white",
                transition: "all 0.2s"
              }}
            >
              Manage Listings ({listings.length})
            </button>
          </div>
        </div>
      </header>

      {/* 📊 MAIN CONTENT CONTAINER */}
      <main style={{ maxWidth: "1200px", margin: "40px auto 0 auto", padding: "0 32px", width: "100%", boxSizing: "border-box" }}>
        
        {/* TAB 1: OVERVIEW METRIC CARDS */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            
            {/* Citizens Card */}
            <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Citizens</span>
                <h3 style={{ fontSize: "36px", fontWeight: 900, color: "#0f172a", margin: "8px 0 0 0" }}>{stats.totalUsers}</h3>
              </div>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(5, 41, 46, 0.08)", color: "#05292e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                <FaUsers />
              </div>
            </div>

            {/* Assets Card */}
            <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}>Active Assets</span>
                <h3 style={{ fontSize: "36px", fontWeight: 900, color: "#0f172a", margin: "8px 0 0 0" }}>{stats.totalListings}</h3>
              </div>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(5, 41, 46, 0.08)", color: "#05292e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                <FaShoppingBag />
              </div>
            </div>

            {/* Inquiries Card */}
            <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}>Secured Inquiries</span>
                <h3 style={{ fontSize: "36px", fontWeight: 900, color: "#0f172a", margin: "8px 0 0 0" }}>{stats.totalChats}</h3>
              </div>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(5, 41, 46, 0.08)", color: "#05292e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                <FaEnvelopeOpen />
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MODERN LISTINGS MANAGEMENT TABLE */}
        {activeTab === "listings" && (
          <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "24px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 900, color: "#0f172a", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Asset Auditing Queue
              </h2>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0", backgroundColor: "#f8fafc", fontSize: "11px", fontWeight: 900, color: "#94a3b8", textTransform: "uppercase" }}>
                    <th style={{ padding: "16px 24px" }}>Asset Title</th>
                    <th style={{ padding: "16px 24px" }}>Price</th>
                    <th style={{ padding: "16px 24px" }}>Status</th>
                    <th style={{ padding: "16px 24px", textAlign: "right" }}>Moderation Actions</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "14px", color: "#334155" }}>
                  {listings.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #e2e8f0", transition: "background-color 0.2s" }} onMouseOver={(e)=>e.currentTarget.style.backgroundColor="#f8fafc"} onMouseOut={(e)=>e.currentTarget.style.backgroundColor="transparent"}>
                      <td style={{ padding: "16px 24px", fontWeight: "bold", color: "#0f172a" }}>{item.title}</td>
                      <td style={{ padding: "16px 24px", fontFamily: "monospace", fontWeight: "bold", color: "#10b981" }}>${item.price}</td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          backgroundColor: item.status === "approved" ? "#ecfdf5" : item.status === "under-review" ? "#fffbeb" : "#f1f5f9",
                          color: item.status === "approved" ? "#059669" : item.status === "under-review" ? "#d97706" : "#475569"
                        }}>
                          {item.status || "Active"}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "8px" }}>
                          {item.status !== "approved" && (
                            <button 
                              onClick={() => handleUpdateStatus(item.id, "approved")}
                              style={{ border: "none", backgroundColor: "#ecfdf5", color: "#059669", padding: "8px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center" }}
                              title="Approve Asset"
                            >
                              <FaCheckCircle size={16} />
                            </button>
                          )}
                          {item.status !== "under-review" && (
                            <button 
                              onClick={() => handleUpdateStatus(item.id, "under-review")}
                              style={{ border: "none", backgroundColor: "#fffbeb", color: "#d97706", padding: "8px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center" }}
                              title="Flag Asset"
                            >
                              <FaExclamationTriangle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
