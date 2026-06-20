"use client";

import React, { useEffect, useState, use } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import TopNav from "@/app/components/ui/TopNav";
import { ArrowLeft, MessageSquare, Loader2, User, Clock } from "lucide-react";
import Link from "next/link";

export default function InquiryThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // 🧠 THE REPLY STATES
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replySent, setReplySent] = useState(false);

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

  // 🚀 THE DATABASE UPDATE & EMAIL TRANSMISSION FUNCTION
  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setIsSendingReply(true);

    try {
      // 1. Save to Firebase Database
      const docRef = doc(db, "inquiries", id);
      await updateDoc(docRef, {
        status: "replied",
        merchantReply: replyText,
        repliedAt: new Date().toISOString()
      });
      
      // 2. Transmit the Email via our new API Route
      await fetch('/api/send-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerEmail: inquiry.buyerEmail,
          buyerName: inquiry.buyerName,
          subject: inquiry.subject,
          merchantReply: replyText
        })
      });

      // 3. Update local UI
      setInquiry((prev: any) => ({ ...prev, status: "replied", merchantReply: replyText }));
      setReplySent(true);
      setReplyText("");
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply.");
    } finally {
      setIsSendingReply(false);
    }
  };

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
              border: inquiry.status === "unread" ? "1px solid rgba(245, 158, 11, 0.2)" : inquiry.status === "replied" ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(107, 114, 128, 0.2)",
              backgroundColor: inquiry.status === "unread" ? "rgba(245, 158, 11, 0.1)" : inquiry.status === "replied" ? "rgba(16, 185, 129, 0.1)" : "rgba(107, 114, 128, 0.1)",
              color: inquiry.status === "unread" ? "#fbbf24" : inquiry.status === "replied" ? "#10b981" : "#9ca3af",
              marginBottom: "12px"
            }}>
              {inquiry.status || "New"}
            </span>
            <h1 style={{ fontSize: "32px", fontWeight: 900, margin: "0 0 32px 0" }}>{inquiry.subject}</h1>
          </div>
        </div>

        {/* Message Ledger */}
        <div style={{ backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
          
          <div style={{ backgroundColor: "rgba(0,0,0,0.2)", padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "center", fontSize: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#d1d5db" }}>
              <User size={16} color="#C5A059" />
              <span style={{ fontWeight: "bold", color: "white" }}>{inquiry.buyerName}</span>
              <span style={{ color: "#6b7280" }}>({inquiry.buyerEmail})</span>
              {inquiry.buyerPhone && <span style={{ color: "#6b7280" }}>- {inquiry.buyerPhone}</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#9ca3af", fontFamily: "monospace", fontSize: "12px", marginLeft: "auto" }}>
              <Clock size={14} color="#C5A059" />
              {new Date(inquiry.createdAt).toLocaleString()}
            </div>
          </div>

          <div style={{ padding: "48px" }}>
            <div style={{ whiteSpace: "pre-wrap", color: "#e5e7eb", lineHeight: "1.8", fontSize: "18px", fontWeight: 300 }}>
              {inquiry.message}
            </div>
          </div>
        </div>

        {/* 🚀 THE WORKING REPLY SECTION */}
        <div style={{ marginTop: "32px", backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "32px" }}>
          {replySent || inquiry?.merchantReply ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <h3 style={{ color: "#C5A059", fontSize: "14px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>Response Transmitted</h3>
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>Your reply has been logged and the thread is marked as resolved.</p>
              
              <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "8px", color: "#e5e7eb", textAlign: "left", fontSize: "15px", fontStyle: "italic", borderLeft: "3px solid #C5A059" }}>
                "{inquiry.merchantReply || replyText}"
              </div>
            </div>
          ) : (
            <>
              <h3 style={{ color: "#C5A059", fontSize: "12px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <MessageSquare size={14} /> Transmit Reply
              </h3>
              <textarea 
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{ width: "100%", backgroundColor: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "16px", color: "#ffffff", outline: "none", resize: "none", marginBottom: "16px", boxSizing: "border-box", fontSize: "14px" }}
                placeholder="Draft your response to the client here..."
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button 
                  onClick={handleSendReply}
                  disabled={isSendingReply || !replyText.trim()}
                  style={{ 
                    backgroundColor: isSendingReply || !replyText.trim() ? "#475569" : "#C5A059", 
                    color: "#000000", 
                    fontWeight: 900, 
                    textTransform: "uppercase", 
                    letterSpacing: "1px", 
                    fontSize: "12px", 
                    padding: "14px 28px", 
                    border: "none", 
                    borderRadius: "8px", 
                    cursor: isSendingReply || !replyText.trim() ? "not-allowed" : "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {isSendingReply ? "Transmitting..." : "Send Response"}
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
