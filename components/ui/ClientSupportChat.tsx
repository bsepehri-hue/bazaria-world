"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase"; 
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { FiSend, FiX, FiMessageSquare, FiSmile, FiMeh, FiFrown } from "react-icons/fi";

interface Message {
  id: string;
  text?: string;
  message?: string;
  sender?: string;
  isAgent?: boolean;
  senderUid?: string;
  createdAt?: any;
}

export default function ClientSupportChat() {
  const pathname = usePathname();
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [rating, setRating] = useState<"positive" | "neutral" | "negative" | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const internalAgentRoutes = ["/rewards", "/dashboard", "/settings", "/profile"];
  const isAgentView = internalAgentRoutes.some(route => pathname?.startsWith(route));

  // 📡 1. WATCH CROSS-TAB STORAGE ALERTS
  useEffect(() => {
    if (isAgentView) return;

    const syncSessionChannel = () => {
      const activeId = localStorage.getItem("bazaria_active_ticket");
      if (activeId && activeId !== ticketId) {
        console.log(`🔌 Support Chat locked onto active room: ${activeId}`);
        setTicketId(activeId);
      }
    };

    const handleCrossTabEvents = (e: StorageEvent) => {
      if (e.key === "bazaria_active_ticket") syncSessionChannel();
      if (e.key === "bazaria_agent_ping") {
        console.log("⚡ Cross-tab Agent ping received! Slapping window open.");
        setIsOpen(true);
      }
    };

    syncSessionChannel();

    window.addEventListener("new-ticket-created", syncSessionChannel);
    window.addEventListener("storage", handleCrossTabEvents);

    return () => {
      window.removeEventListener("new-ticket-created", syncSessionChannel);
      window.removeEventListener("storage", handleCrossTabEvents);
    };
  }, [ticketId, isAgentView]);

  // 📡 2. FIREBASE REAL-TIME SYNC
  useEffect(() => {
    if (!ticketId || isAgentView) return;

    console.log(`📡 Linking client socket onto: /support_tickets/${ticketId}/messages`);
    const messagesRef = collection(db, "support_tickets", ticketId, "messages");
    const q = query(messagesRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      console.log("📥 DATA VERIFICATION COMPLETE:", fetchedMessages);
      setMessages(fetchedMessages);
    }, (error) => {
      console.error("Firestore snapshot error:", error);
    });

    return () => unsubscribe();
  }, [ticketId, isAgentView]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (isAgentView) return null; 

  // ⚡ HANDLERS: SEND CLIENT MESSAGE
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !ticketId) return;

    try {
      const messagesRef = collection(db, "support_tickets", ticketId, "messages");
      
      await addDoc(messagesRef, {
        text: inputText.trim(),
        sender: "client",
        isAgent: false,
        createdAt: serverTimestamp(),
      });

      const ticketDocRef = doc(db, "support_tickets", ticketId);
      await setDoc(ticketDocRef, {
        lastMessage: inputText.trim(),
        updatedAt: serverTimestamp(),
        status: "active"
      }, { merge: true });

      setInputText("");
    } catch (err) {
      console.error("Error writing message:", err);
    }
  };

  const handleRateConversation = async (selectedRating: "positive" | "neutral" | "negative") => {
    if (!ticketId) return;
    setRating(selectedRating);
    try {
      const ticketDocRef = doc(db, "support_tickets", ticketId);
      await setDoc(ticketDocRef, {
        clientFeedbackRating: selectedRating,
        status: "resolved", 
        feedbackSubmittedAt: serverTimestamp()
      }, { merge: true });
      setTimeout(() => {
        setIsOpen(false);
        setRating(null);
      }, 800);
    } catch (err) {
      console.error("Error logging rating:", err);
    }
  };

  return (
    <div style={{ 
      width: "340px", 
      height: "480px", 
      backgroundColor: "#021518", 
      border: "2px solid #1e293b", 
      borderRadius: "12px", 
      display: isOpen ? "block" : "none", // Using plain block formatting to insulate heights
      boxShadow: "0px 10px 25px rgba(0,0,0,0.5)", 
      position: "fixed", 
      bottom: "85px", 
      left: "24px", 
      zIndex: 99999, 
      fontFamily: "sans-serif",
      overflow: "hidden"
    }}>
      
      {/* Header Banner */}
      <div style={{ padding: "12px 16px", backgroundColor: "#03252a", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", height: "45px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiMessageSquare color="#00fcd2" size={16} />
          <span style={{ color: "#ffffff", fontSize: "13px", fontWeight: 600 }}>Live Support Chat</span>
        </div>
        <button type="button" onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
          <FiX color="#94a3b8" size={16} />
        </button>
      </div>

      {/* 💬 FIXED: Message Output Scroll Window (Explicitly calculated height box) */}
      <div style={{ 
        height: "285px", 
        padding: "16px", 
        overflowY: "auto", 
        backgroundColor: "#010e10",
        boxSizing: "border-box",
        display: "block"
      }}>
        {messages.length === 0 ? (
          <div style={{ color: "#64748b", fontSize: "12px", textAlign: "center", marginTop: "40px" }}>
            No messages yet.
          </div>
        ) : (
          messages.map((msg, index) => {
            const isClientSide = msg.sender === "client" || msg.isAgent === false || msg.senderUid === "CLIENT";
            const textContent = msg.text || msg.message || "Message parsing error.";

            return (
              <div key={msg.id || index} style={{ display: "block", textAlign: isClientSide ? "right" : "left", margin: "10px 0", width: "100%" }}>
                <div style={{
                  display: "inline-block",
                  maxWidth: "80%", 
                  padding: "10px 12px", 
                  borderRadius: "8px", 
                  fontSize: "13px", 
                  lineHeight: "1.4",
                  textAlign: "left",
                  // High contrast color protection logic
                  color: isClientSide ? "#ffffff" : "#021518",
                  backgroundColor: isClientSide ? "#02373e" : "#00fcd2",
                  border: isClientSide ? "1px solid #1e293b" : "none",
                  wordBreak: "break-word"
                }}>
                  {textContent}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Action Form Tray */}
      <form onSubmit={handleSendMessage} style={{ padding: "10px", backgroundColor: "#021518", borderTop: "1px solid #1e293b", display: "flex", gap: "8px", alignItems: "center", height: "55px", boxSizing: "border-box" }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          style={{ flexGrow: 1, height: "34px", backgroundColor: "#010e10", border: "1px solid #1e293b", borderRadius: "6px", padding: "0 10px", color: "#ffffff", fontSize: "13px", outline: "none" }}
        />
        <button type="submit" style={{ width: "34px", height: "34px", backgroundColor: "#00fcd2", border: "none", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <FiSend color="#021518" size={14} />
        </button>
      </form>

      {/* Close & Rate Footer Container */}
      <div style={{ padding: "10px 16px", backgroundColor: "#03252a", borderTop: "1px solid #1e293b", display: "flex", flexDirection: "column", gap: "4px", alignItems: "center", height: "95px", boxSizing: "border-box" }}>
        <div style={{ color: "#94a3b8", fontSize: "10px", fontWeight: 500 }}>Resolve Conversation</div>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "4px" }}>
          <button type="button" onClick={() => handleRateConversation("positive")} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: rating === "positive" ? "#22c55e" : "#94a3b8", fontSize: "12px" }}>
            <FiSmile size={14} /> Good
          </button>
          <button type="button" onClick={() => handleRateConversation("neutral")} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: rating === "neutral" ? "#eab308" : "#94a3b8", fontSize: "12px" }}>
            <FiMeh size={14} /> Okay
          </button>
          <button type="button" onClick={() => handleRateConversation("negative")} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: rating === "negative" ? "#ef4444" : "#94a3b8", fontSize: "12px" }}>
            <FiFrown size={14} /> Bad
          </button>
        </div>
      </div>

    </div>
  );
}
