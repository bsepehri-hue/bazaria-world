Ah, my bad! That error happens because a curly brace { or parenthesis ( got left unclosed when dropping that snippet into the file. It broke the JSX syntax right at the very end of the component.

Let’s bypass the guesswork entirely and make it perfectly clean. Here is the entire diagnostic file rewritten with that code integrated cleanly, so you can just select all, paste it over your current file, and clear the build error instantly.

Open @/components/ui/ClientSupportChat.tsx, wipe it clean, and paste this in:

TypeScript
"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase"; 
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { FiSend, FiX } from "react-icons/fi";

export default function ClientSupportChat() {
  const pathname = usePathname();
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const internalAgentRoutes = ["/rewards", "/dashboard", "/settings", "/profile"];
  const isAgentView = internalAgentRoutes.some(route => pathname?.startsWith(route));

  useEffect(() => {
    if (isAgentView) return;
    const syncSessionChannel = () => {
      const activeId = localStorage.getItem("bazaria_active_ticket");
      if (activeId && activeId !== ticketId) {
        setTicketId(activeId);
      }
    };
    const handleCrossTabEvents = (e: StorageEvent) => {
      if (e.key === "bazaria_active_ticket") syncSessionChannel();
      if (e.key === "bazaria_agent_ping") setIsOpen(true);
    };
    syncSessionChannel();
    window.addEventListener("new-ticket-created", syncSessionChannel);
    window.addEventListener("storage", handleCrossTabEvents);
    return () => {
      window.removeEventListener("new-ticket-created", syncSessionChannel);
      window.removeEventListener("storage", handleCrossTabEvents);
    };
  }, [ticketId, isAgentView]);

  useEffect(() => {
    if (!ticketId || isAgentView) return;
    const messagesRef = collection(db, "support_tickets", ticketId, "messages");
    const unsubscribe = onSnapshot(query(messagesRef), (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(fetched);
    });
    return () => unsubscribe();
  }, [ticketId, isAgentView]);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  if (isAgentView) return null; 

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !ticketId) return;
    try {
      await addDoc(collection(db, "support_tickets", ticketId, "messages"), {
        text: inputText.trim(),
        sender: "client",
        isAgent: false,
        createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, "support_tickets", ticketId), {
        lastMessage: inputText.trim(),
        updatedAt: serverTimestamp(),
        status: "active"
      }, { merge: true });
      setInputText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ 
      width: "340px", height: "480px", backgroundColor: "#000000", border: "3px solid #ff0055", 
      borderRadius: "12px", display: isOpen ? "flex" : "none", flexDirection: "column", 
      position: "fixed", bottom: "90px", left: "24px", zIndex: 999999, overflow: "hidden"
    }}>
      
      {/* Header Banner */}
      <div style={{ padding: "12px", backgroundColor: "#111", borderBottom: "1px solid #ff0055", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#ffffff", fontSize: "14px", fontWeight: "bold" }}>🚨 DIAGNOSTIC MODE CHAT</span>
        <button type="button" onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}><FiX size={18} /></button>
      </div>

      {/* 💬 DIAGNOSTIC CHANNEL MAPPING CONTAINER */}
      <div style={{ flex: 1, padding: "12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", backgroundColor: "#050505" }}>
        <div style={{ color: "#ffff00", fontSize: "11px", borderBottom: "1px dashed #333", paddingBottom: "4px" }}>
          Active Room ID: {ticketId || "NULL"} | Items Loaded: {messages.length}
        </div>
        
        {messages.map((msg, index) => {
          const isClientSide = msg.sender === "client" || msg.isAgent === false;
          const textContent = msg.text || msg.message || "";

          return (
            <div key={msg.id || index} style={{ 
              padding: "8px", 
              margin: "4px 0", 
              backgroundColor: "#1c1c1c", 
              borderLeft: isClientSide ? "4px solid #00ffcc" : "4px solid #ffcc00",
              borderRadius: "4px"
            }}>
              <div style={{ color: "#ffffff", fontSize: "13px", fontWeight: "bold", marginBottom: "2px" }}>
                Text Content: {textContent ? String(textContent) : `⚠️ Missing text property! Fields present: ${Object.keys(msg).join(", ")}`}
              </div>
              <div style={{ color: "#888888", fontSize: "10px", fontFamily: "monospace" }}>
                Raw Doc Object: {JSON.stringify(msg)}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Tray */}
      <form onSubmit={handleSendMessage} style={{ padding: "10px", backgroundColor: "#111", borderTop: "1px solid #ff0055", display: "flex", gap: "6px" }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Send test transmission..."
          style={{ flexGrow: 1, height: "36px", backgroundColor: "#000", border: "1px solid #ff0055", borderRadius: "6px", padding: "0 10px", color: "#fff", fontSize: "13px" }}
        />
        <button type="submit" style={{ width: "40px", backgroundColor: "#ff0055", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FiSend /></button>
      </form>
    </div>
  );
}
