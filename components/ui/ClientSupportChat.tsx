"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase"; 
// 🔄 ADDED setDoc HERE TO MATCH LINE 107 PERFECTLY:
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, setDoc, updateDoc } from "firebase/firestore";
import { FiSend, FiX, FiMessageSquare, FiSmile, FiMeh, FiFrown } from "react-icons/fi";

interface Message {
  id: string;
  text: string;
  sender: string;
  isAgent?: boolean;
  createdAt: any;
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

  // 📡 1. WATCH CROSS-TAB ALERTS
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
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      console.log(`📥 Client chat loaded ${fetchedMessages.length} fresh messages.`);
      setMessages(fetchedMessages);
    }, (error) => {
      console.error("Firestore snapshot error:", error);
    });

    return () => unsubscribe();
  }, [ticketId, isAgentView]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

      // 🔄 FIX: Change updateDoc to setDoc with merge: true to prevent "No document to update" crash!
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
      await updateDoc(ticketDocRef, {
        clientFeedbackRating: selectedRating,
        status: "resolved", 
        feedbackSubmittedAt: serverTimestamp()
      });
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
      width: "340px", height: "480px", backgroundColor: "#021518", border: "1px solid #1e293b", 
      borderRadius: "12px", display: "flex", flexDirection: "column", boxShadow: "0px 10px 25px rgba(0,0,0,0.5)", 
      position: "fixed", bottom: "24px", left: "24px", zIndex: 1000, overflow: "hidden", fontFamily: "sans-serif",
      transform: isOpen ? "translateY(0)" : "translateY(calc(100% + 40px))",
      opacity: isOpen ? 1 : 0,
      pointerEvents: isOpen ? "auto" : "none",
      transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease"
    }}>
      {/* Header */}
      <div style={{ padding: "14px 16px", backgroundColor: "#03252a", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiMessageSquare color="#00fcd2" size={16} />
          <span style={{ color: "#ffffff", fontSize: "13px", fontWeight: 600 }}>Live Agent Response</span>
        </div>
        <button type="button" onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
          <FiX color="#94a3b8" size={16} />
        </button>
      </div>

      {/* 💬 Live Stream Output Deck */}
      <div className="no-scrollbar" style={{ flexGrow: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#010e10" }}>
        {messages.length === 0 ? (
          <div style={{ color: "#64748b", fontSize: "11px", textAlign: "center", marginTop: "40px" }}>
            Awaiting agent data handshake synchronization...
          </div>
        ) : (
          messages.map((msg, index) => {
            // 🔄 FAIL-SAFE EVALUATION: Check every possible property flag from both files
            const isClientSide = msg.sender === "client" || 
                                 msg.isAgent === false || 
                                 msg.senderUid === "CLIENT" ||
                                 (!msg.isAgent && msg.senderUid !== "SYSTEM");

            // Extract text string safely regardless of capitalization or wrapper key anomalies
            const textContent = msg.text || (msg as any).message || "Empty transmission payload.";

            return (
              <div key={msg.id || index} style={{ display: "flex", justifyContent: isClientSide ? "flex-end" : "flex-start", width: "100%" }}>
                <div style={{
                  maxWidth: "75%", 
                  padding: "10px 12px", 
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

      {/* Input */}
      <form onSubmit={handleSendMessage} style={{ padding: "10px 12px", backgroundColor: "#021518", borderTop: "1px solid #1e293b", display: "flex", gap: "8px", alignItems: "center" }}>
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

      {/* Footer Ratings */}
      <div style={{ padding: "10px 12px", backgroundColor: "#03252a", borderTop: "1px solid #1e293b", display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
        <div style={{ color: "#94a3b8", fontSize: "10px", fontWeight: 500 }}>Resolve & Close Conversation</div>
        <div style={{ display: "flex", gap: "12px", width: "100%", justifyContent: "center" }}>
          <button type="button" onClick={() => handleRateConversation("positive")} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: rating === "positive" ? "1px solid #22c55e" : "1px solid transparent", borderRadius: "4px", padding: "4px 8px", cursor: "pointer", color: rating === "positive" ? "#22c55e" : "#94a3b8", fontSize: "11px" }}>
            <FiSmile size={14} color={rating === "positive" ? "#22c55e" : "#94a3b8"} /> Positive
          </button>
          <button type="button" onClick={() => handleRateConversation("neutral")} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: rating === "neutral" ? "1px solid #eab308" : "1px solid transparent", borderRadius: "4px", padding: "4px 8px", cursor: "pointer", color: rating === "neutral" ? "#eab308" : "#94a3b8", fontSize: "11px" }}>
            <FiMeh size={14} color={rating === "neutral" ? "#eab308" : "#94a3b8"} /> Neutral
          </button>
          <button type="button" onClick={() => handleRateConversation("negative")} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: rating === "negative" ? "1px solid #ef4444" : "1px solid transparent", borderRadius: "4px", padding: "4px 8px", cursor: "pointer", color: rating === "negative" ? "#ef4444" : "#94a3b8", fontSize: "11px" }}>
            <FiFrown size={14} color={rating === "negative" ? "#ef4444" : "#94a3b8"} /> Negative
          </button>
        </div>
      </div>
    </div>
  );
}
