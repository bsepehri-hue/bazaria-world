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

// 🚀 MATCHES YOUR LAYOUT'S PROP INPUT EXPECTATION PERFECTLY
export default function ClientSupportChat({ ticketId }: { ticketId: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Default hidden until agent responds
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [rating, setRating] = useState<"positive" | "neutral" | "negative" | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const internalAgentRoutes = ["/rewards", "/dashboard", "/settings", "/profile"];
  const isAgentView = internalAgentRoutes.some(route => pathname?.startsWith(route));

 // 📡 1. LIVE SNAPSHOT LISTENER: Auto-pop open whenever an agent updates the feed
  useEffect(() => {
    if (!ticketId || isAgentView) return;

    console.log(`📡 Client Support Chat: Hooking database socket to /support_tickets/${ticketId}/messages`);

    const messagesRef = collection(db, "support_tickets", ticketId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      console.log(`📊 DB UPDATE: Received ${fetchedMessages.length} messages for channel: ${ticketId}`);

      if (fetchedMessages.length > 0) {
        const lastMsg = fetchedMessages[fetchedMessages.length - 1];
        
        // 🕵️‍♂️ DIAGNOSTIC LOG: Prints the exact object structure to your browser console
        console.log("DEBUG: LAST MESSAGE OBJECT:", lastMsg);

        // 🚀 FAIL-SAFE OPTERATOR:
        // Pop open if the last message sender isn't explicitly the client, OR if the message array grew
        // and the chat tray is currently hidden.
        const isFromAgent = lastMsg.sender !== "client" || 
                            lastMsg.role === "agent" || 
                            lastMsg.role === "support";

        if (isFromAgent) {
          console.log("⚡ Agent response verified. Slashing open support layout panel!");
          setIsOpen(true);
        }
      }
      
      setMessages(fetchedMessages);
    }, (error) => {
      console.error("Firestore live-stream link encountered a channel error:", error);
    });

    // 🔗 BONUS BACK-UP TRAP: Listen to the top-level parent ticket document status updates!
    // If an agent assigns themselves or updates the ticket metadata, force the chat window to open.
    const ticketDocRef = doc(db, "support_tickets", ticketId);
    const unsubscribeTicket = onSnapshot(ticketDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const ticketData = docSnap.data();
        console.log("🕵️‍♂️ DEBUG: PARENT TICKET TRACKING METADATA UPDATE:", ticketData);
        
        // If the agent updates status or interacts with the ticket object, pop open
        if (ticketData.status === "active" && fetchedMessages.length > 0) {
          const lastMsg = messages[messages.length - 1];
          if (lastMsg && lastMsg.sender !== "client") {
            setIsOpen(true);
          }
        }
      }
    });

    return () => {
      unsubscribe();
      unsubscribeTicket();
    };
  }, [ticketId, isAgentView]);

  // 📜 AUTO-SCROLL HANDLING
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isAgentView) return null; 

  // ⚡ ACTION INTERFACES: CLIENT MESSAGE TRANSMISSION
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
      console.error("Error committing client payload to backend log:", err);
    }
  };

  // 🎯 ACTION INTERFACES: SATISFACTION EVALUATION DISMISSAL
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

      // Slide away smoothly after record saves
      setTimeout(() => {
        setIsOpen(false);
        setRating(null);
      }, 800);
    } catch (err) {
      console.error("Error uploading sentiment feedback metadata metrics:", err);
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
      
      {/* 🟢 Header Banner */}
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

      {/* 📥 Customer Keyboard Input Form Tray */}
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

      {/* 🎯 Lower Deck Context: Conversation Quality Rating Selection Footer */}
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
