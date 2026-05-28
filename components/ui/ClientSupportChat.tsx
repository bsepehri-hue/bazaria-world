"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation"; // 🚀 Added to track route paths
import { db } from "@/lib/firebase"; 
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { FiSend, FiX, FiMessageSquare, FiSmile, FiMeh, FiFrown } from "react-icons/fi";

interface Message {
  id: string;
  text: string;
  sender: "agent" | "client";
  createdAt: any;
}

export default function ClientSupportChat({ ticketId }: { ticketId: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // 🚀 Hidden by default
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [rating, setRating] = useState<"positive" | "neutral" | "negative" | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🛡️ SECURITY GUARD: Completely kill rendering on agent-facing internal back-office routes
  const internalAgentRoutes = ["/rewards", "/dashboard", "/settings", "/profile"];
  const isAgentView = internalAgentRoutes.some(route => pathname?.startsWith(route));
  
  // Listen for custom trigger events to pop it open automatically!
  useEffect(() => {
    const handleForceOpen = () => setIsOpen(true);
    window.addEventListener("open-client-chat", handleForceOpen);
    return () => window.removeEventListener("open-client-chat", handleForceOpen);
  }, []);

  // 📡 LISTEN TO LIVE AGENT RESPONSES
  useEffect(() => {
    if (!ticketId || isAgentView) return;

    const messagesRef = collection(db, "support_tickets", ticketId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [ticketId, isAgentView]);

  // 📜 AUTO-SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isAgentView) return null; // 🛑 Force vanish on operations panels

  // ⚡ SEND MESSAGE TO AGENT
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !ticketId) return;

    try {
      const messagesRef = collection(db, "support_tickets", ticketId, "messages");
      await addDoc(messagesRef, {
        text: inputText.trim(),
        sender: "client",
        createdAt: serverTimestamp(),
      });

      const ticketDocRef = doc(db, "support_tickets", ticketId);
      await updateDoc(ticketDocRef, {
        lastMessage: inputText.trim(),
        updatedAt: serverTimestamp(),
        status: "active"
      });

      setInputText("");
    } catch (err) {
      console.error("Error sending client message:", err);
    }
  };

  // 🎯 SUBMIT RATING
  const handleRateConversation = async (selectedRating: "positive" | "neutral" | "negative") => {
    setRating(selectedRating);
    try {
      const ticketDocRef = doc(db, "support_tickets", ticketId);
      await updateDoc(ticketDocRef, {
        clientFeedbackRating: selectedRating,
        feedbackSubmittedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error submitting ticket rating:", err);
    }
  };

  return (
    <>
      {/* 🔮 THE COLLAPSED CHAT BUBBLE TRIGGER */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed", bottom: "24px", right: "24px", width: "56px", height: "56px",
            backgroundColor: "#00fcd2", borderRadius: "50%", display: "flex", alignItems: "center",
            justifyContent: "center", boxShadow: "0px 4px 16px rgba(0,252,210,0.3)",
            border: "none", cursor: "pointer", zIndex: 1000, transition: "transform 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <FiMessageSquare color="#021518" size={24} />
        </button>
      )}

      {/* 💻 THE FLOATING CHAT BOX PANEL */}
      {isOpen && (
        <div style={{ width: "340px", height: "480px", backgroundColor: "#021518", border: "1px solid #1e293b", borderRadius: "12px", display: "flex", flexDirection: "column", boxShadow: "0px 10px 25px rgba(0,0,0,0.5)", position: "fixed", bottom: "24px", right: "24px", zIndex: 1000, overflow: "hidden", fontFamily: "sans-serif" }}>
          
          {/* Header bar */}
          <div style={{ padding: "14px 16px", backgroundColor: "#03252a", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FiMessageSquare color="#00fcd2" size={16} />
              <span style={{ color: "#ffffff", fontSize: "13px", fontWeight: 600 }}>Live Support Chat</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
              <FiX color="#94a3b8" size={16} />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="no-scrollbar" style={{ flexGrow: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#010e10" }}>
            {messages.length === 0 ? (
              <div style={{ color: "#64748b", fontSize: "11px", textAlign: "center", marginTop: "40px" }}>
                Connected to Support. Type below to message an active agent...
              </div>
            ) : (
              messages.map((msg) => {
                const isClient = msg.sender === "client";
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: isClient ? "flex-end" : "flex-start", width: "100%" }}>
                    <div style={{
                      maxWidth: "75%", padding: "10px 12px", borderRadius: "8px", fontSize: "12px", lineHeight: "1.4",
                      color: isClient ? "#ffffff" : "#021518",
                      backgroundColor: isClient ? "#02373e" : "#00fcd2",
                      border: isClient ? "1px solid #1e293b" : "none",
                    }}>
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form Tray */}
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

          {/* Ratings System */}
          <div style={{ padding: "10px 12px", backgroundColor: "#03252a", borderTop: "1px solid #1e293b", display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
            <div style={{ color: "#94a3b8", fontSize: "10px", fontWeight: 500 }}>Rate this Conversation</div>
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
      )}
    </>
  );
}
