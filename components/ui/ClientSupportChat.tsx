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

      console.log("📥 DATA VERIFICATION:", fetchedMessages);
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
      height: "450px", 
      backgroundColor: "#021518", 
      border: "1px solid #1e293b", 
      borderRadius: "12px", 
      display: isOpen ? "flex" : "none", // Fixed: Use direct visibility toggles to fix structural clipping
      flexDirection: "column", 
      boxShadow: "0px 10px 25px rgba(0,0,0,0.5)", 
      position: "fixed", 
      bottom: "80px", // Pushed up above bottom bar navigation links
      left: "24px", 
      zIndex: 9999, 
      overflow: "hidden", 
      fontFamily: "sans-serif"
    }}>
      
      {/* Header Banner */}
      <div style={{ padding: "12px 16px", backgroundColor: "#03252a", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiMessageSquare color="#00fcd2" size={16} />
          <span style={{ color: "#ffffff", fontSize: "13px", fontWeight: 600 }}>Live Support Chat</span>
        </div>
        <button type="button" onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
          <FiX color="#94a3b8" size={16} />
        </button>
      </div>

      {/* Message Output Box */}
      <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#010e10" }}>
        {messages.length === 0 ? (
          <div style={{ color: "#64748b", fontSize: "11px", textAlign: "center", marginTop: "40px" }}>
            No messages yet.
          </div>
        ) : (
          messages.map((msg, index) => {
            const isClientSide = msg.sender === "client" || msg.isAgent === false || msg.senderUid === "CLIENT";
            const textContent = msg.text || msg.message || "Empty content payload.";

            return (
              <div key={msg.id || index} style={{ display: "flex", justifyContent: isClientSide ? "flex-end" : "flex-start", width: "100%" }}>
                <div style={{
                  maxWidth: "80%", 
                  padding: "8px 12px", 
                  borderRadius: "8px", 
                  fontSize: "12px", 
                  lineHeight: "1.4",
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
      <form onSubmit={handleSendMessage} style={{ padding: "10px", backgroundColor: "#021518", borderTop: "1px solid #1e293b", display: "flex", gap: "6px", alignItems: "center", flexShrink: 0 }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          style={{ flexGrow: 1, height: "34px", backgroundColor: "#010e10", border: "1px solid #1e293b", borderRadius: "6px", padding: "0 10px", color: "#ffffff", fontSize: "12px", outline: "none" }}
        />
        <button type="submit" style={{ width: "34px", height: "34px", backgroundColor: "#00fcd2", border: "none", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <FiSend color="#021518" size={14} />
        </button>
      </form>

      {/* Close & Rate Footer Container */}
      <div style={{ padding: "8px 10px", backgroundColor: "#03252a", borderTop: "1px solid #1e293b", display: "flex", flexDirection: "column", gap: "4px", alignItems: "center", flexShrink: 0 }}>
        <div style={{ color: "#94a3b8", fontSize: "9px", fontWeight: 500 }}>Resolve Conversation</div>
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <button type="button" onClick={() => handleRateConversation("positive")} style={{ display: "flex", alignItems: "center", gap: "3px", background: "none", border: "none", cursor: "pointer", color: rating === "positive" ? "#22c55e" : "#94a3b8", fontSize: "11px" }}>
            <FiSmile size={12} /> Good
          </button>
          <button type="button" onClick={() => handleRateConversation("neutral")} style={{ display: "flex", alignItems: "center", gap: "3px", background: "none", border: "none", cursor: "pointer", color: rating === "neutral" ? "#eab308" : "#94a3b8", fontSize: "11px" }}>
            <FiMeh size={12} /> Okay
          </button>
          <button type="button" onClick={() => handleRateConversation("negative")} style={{ display: "flex", alignItems: "center", gap: "3px", background: "none", border: "none", cursor: "pointer", color: rating === "negative" ? "#ef4444" : "#94a3b8", fontSize: "11px" }}>
            <FiFrown size={12} /> Bad
          </button>
        </div>
      </div>

    </div>
  );
}
