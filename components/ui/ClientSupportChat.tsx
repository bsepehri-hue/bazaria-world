"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase"; 
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { FiSend, FiX, FiMessageSquare, FiSmile, FiMeh, FiFrown } from "react-icons/fi";

interface Message {
  id: string;
  text: string;
  sender: "agent" | "client";
  createdAt: any;
}

export default function ClientSupportChat() { // 🚀 Removed ticketId prop dependency
  const pathname = usePathname();
  const [currentTicketId, setCurrentTicketId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // 🔒 Back to default hidden
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [rating, setRating] = useState<"positive" | "neutral" | "negative" | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const internalAgentRoutes = ["/rewards", "/dashboard", "/settings", "/profile"];
  const isAgentView = internalAgentRoutes.some(route => pathname?.startsWith(route));

  // 📡 1. SESSION INTERCEPTOR: Watch the local browser storage like a hawk
  useEffect(() => {
    if (isAgentView) return;

    const syncActiveSessionChannel = () => {
      const activeId = localStorage.getItem("bazaria_active_ticket");
      if (activeId && activeId !== currentTicketId) {
        console.log(`🔌 Client Chat Box dynamically routing data feed to channel: ${activeId}`);
        setCurrentTicketId(activeId);
      }
    };

    // Run immediately when client loads
    syncActiveSessionChannel();

    // Catch custom events fired by your AIConciergeDrawer
    window.addEventListener("new-ticket-created", syncActiveSessionChannel);
    window.addEventListener("storage", syncActiveSessionChannel);

    return () => {
      window.removeEventListener("new-ticket-created", syncActiveSessionChannel);
      window.removeEventListener("storage", syncActiveSessionChannel);
    };
  }, [currentTicketId, isAgentView]);

  // 📡 2. FIREBASE SNAPSHOT STREAM: Subscribes to the live synchronized channel
  useEffect(() => {
    if (!currentTicketId || isAgentView) return;

    console.log(`📡 Opening live Firestore link into: /support_tickets/${currentTicketId}/messages`);

    const messagesRef = collection(db, "support_tickets", currentTicketId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      if (fetchedMessages.length > 0) {
        const lastMsg = fetchedMessages[fetchedMessages.length - 1];
        
        // 🚀 THE MAGIC AUTO-POPUP: Open up if the agent has added a new response!
        if (lastMsg && lastMsg.sender !== "client") {
          console.log("⚡ Live Agent response detected! Animating client tray open.");
          setIsOpen(true);
        }
      }
      
      setMessages(fetchedMessages);
    }, (error) => {
      console.error("Firestore live stream tracking encountered an issue:", error);
    });

    return () => unsubscribe();
  }, [currentTicketId, isAgentView]);

  // 📜 AUTO-SCROLL ENGINE
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isAgentView) return null; 

  // ⚡ HANDLERS: SEND MESSAGE
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentTicketId) return;

    try {
      const messagesRef = collection(db, "support_tickets", currentTicketId, "messages");
      await addDoc(messagesRef, {
        text: inputText.trim(),
        sender: "client",
        createdAt: serverTimestamp(),
      });

      const ticketDocRef = doc(db, "support_tickets", currentTicketId);
      await updateDoc(ticketDocRef, {
        lastMessage: inputText.trim(),
        updatedAt: serverTimestamp(),
        status: "active"
      });

      setInputText("");
    } catch (err) {
      console.error("Error sending client text:", err);
    }
  };

  // 🎯 HANDLERS: FEEDBACK RATING CLOSURE
  const handleRateConversation = async (selectedRating: "positive" | "neutral" | "negative") => {
    if (!currentTicketId) return;
    setRating(selectedRating);
    try {
      const ticketDocRef = doc(db, "support_tickets", currentTicketId);
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
      console.error("Error logging customer evaluation score:", err);
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
      {/* 🟢 Header */}
      <div style={{ padding: "14px 16px", backgroundColor: "#03252a", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiMessageSquare color="#00fcd2" size={16} />
          <span style={{ color: "#ffffff", fontSize: "13px", fontWeight: 600 }}>Live Agent Response</span>
        </div>
        <button type="button" onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
          <FiX color="#94a3b8" size={16} />
        </button>
      </div>

      {/* 💬 Message Stream Container */}
      <div className="no-scrollbar" style={{ flexGrow: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#010e10" }}>
        {messages.length === 0 ? (
          <div style={{ color: "#64748b", fontSize: "11px", textAlign: "center", marginTop: "40px" }}>
            Connecting with support agent...
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

      {/* 📥 Input tray */}
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

      {/* 🎯 Bottom deck utility feedback scoring footer */}
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
