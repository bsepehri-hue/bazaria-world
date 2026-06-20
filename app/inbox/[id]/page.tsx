"use client";

import React, { useEffect, useState, use } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import TopNav from "@/app/components/ui/TopNav";
import { ArrowLeft, MessageSquare, Loader2, User, Clock } from "lucide-react";
import Link from "next/link";

export default function InquiryThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const docRef = doc(db, "inquiries", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInquiry({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Failed to load inquiry:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInquiry();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#021a1d", display: "flex", alignItems: "center", justifyContent: "center", color: "#C5A059" }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#021a1d", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>Thread Not Found</h2>
        <Link href="/dashboard?tab=INBOX" style={{ color: "#C5A059", textDecoration: "none" }}>
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#021a1d", color: "#ffffff", position: "relative", overflowX: "hidden", fontFamily: "sans-serif" }}>
      <TopNav />
      
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px", paddingBottom: "80px" }}>
        
        {/* Header / Back Button */}
        <div style={{ marginBottom: "32px" }}>
          <Link href="/dashboard?tab=INBOX" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#94a3b8", textDecoration: "none", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px" }}>
            <ArrowLeft size={16} /> Back to Inquiry Desk
          </Link>
          
          <div>
            <span style={{ 
              display: "inline-block", 
              fontSize: "10px", 
              fontWeight: 900, 
              textTransform: "uppercase", 
              letterSpacing: "0.05em", 
              padding: "4px 12px", 
              borderRadius: "50px", 
              border: inquiry.status === "unread" ? "1px solid rgba(245, 158, 11, 0.2)" : "1px solid rgba(107, 114, 128, 0.2)",
              backgroundColor: inquiry.status === "unread" ? "rgba(245, 158, 11, 0.1)" : "rgba(107, 114, 128, 0.1)",
              color: inquiry.status === "unread" ? "#fbbf24" : "#9ca3af",
              marginBottom: "12px"
            }}>
              {inquiry.status || "New"}
            </span>
            <h1 style={{ fontSize: "32px", fontWeight: 900, margin: "0 0 32px 0" }}>{inquiry.subject}</h1>
          </div>
        </div>

        {/* Message Ledger */}
        <div style={{ backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
          
          {/* Metadata Bar */}
          <div style={{ backgroundColor: "rgba(0,0,0,0.2)", padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "center", fontSize: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#d1d5db" }}>
              <User size={16} color="#C5A059" />
              <span style={{ fontWeight: "bold", color: "white" }}>{inquiry.buyerName}</span>
              <span style={{ color: "#6b7280" }}>({inquiry.buyerEmail})</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#9ca3af", fontFamily: "monospace", fontSize: "12px", marginLeft: "auto" }}>
              <Clock size={14} color="#C5A059" />
              {new Date(inquiry.createdAt).toLocaleString()}
            </div>
          </div>

          {/* Actual Message Body */}
          <div style={{ padding: "48px" }}>
            <div style={{ whiteSpace: "pre-wrap", color: "#e5e7eb", lineHeight: "1.8", fontSize: "18px", fontWeight: 300 }}>
              {inquiry.message}
            </div>
          </div>
          
        </div>

        {/* Reply Section */}
        <div style={{ marginTop: "32px", backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "32px" }}>
          <h3 style={{ color: "#C5A059", fontSize: "12px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <MessageSquare size={14} /> Transmit Reply
          </h3>
          <textarea 
            rows={4}
            style={{ width: "100%", backgroundColor: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "16px", color: "#ffffff", outline: "none", resize: "none", marginBottom: "16px", boxSizing: "border-box", fontSize: "14px" }}
            placeholder="Draft your response to the client here..."
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button style={{ backgroundColor: "#C5A059", color: "#000000", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", fontSize: "12px", padding: "14px 28px", border: "none", borderRadius: "8px", cursor: "pointer" }}>
              Send Response
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
