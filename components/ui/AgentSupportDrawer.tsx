"use strict";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // Adjust paths to your project setup
import { doc, collection, onSnapshot, query, addDoc, serverTimestamp } from "firebase/firestore";

interface AgentSupportDrawerProps {
  roomId: string;
  onClose: () => void;
  agentUser: any; // Your auth user context passed from the dashboard
}

export const AgentSupportDrawer: React.FC<AgentSupportDrawerProps> = ({ roomId, onClose, agentUser }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [ticketData, setTicketData] = useState<any>(null);
  const [replyText, setReplyText] = useState<string>("");

  // 📡 Lifecycle Isolation: Every stream inside here dies the second `onClose` is hit!
  useEffect(() => {
    if (!roomId) return;

    console.log(`🔌 [AGENT CONSOLE TUNNEL] Connecting to Room: ${roomId}`);
    
    // 1. Sync Base Ticket Fields
    const ticketDocRef = doc(db, "support_tickets", roomId);
    const unsubTicket = onSnapshot(ticketDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setTicketData(snapshot.data());
      }
    });

    // 2. Sync Message Subcollection
    const messagesRef = collection(db, "support_tickets", roomId, "messages");
    const qMessages = query(messagesRef);
    const unsubChat = onSnapshot(qMessages, (snapshot) => {
      const msgs = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      
      // Sort messages chronologically by timestamp if available
      msgs.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeA - timeB;
      });

      setMessages(msgs);
    });

    // 🧼 The Bulletproof Eject Button: Runs instantly on unmount
    return () => {
      console.log(`🧼 [AGENT CONSOLE TEARDOWN] Severing background streams for Room: ${roomId}`);
      unsubTicket();
      unsubChat();
    };
  }, [roomId]);

  // ⚡ Message Transmission Handler
  const handleSendMessage = async () => {
    if (!replyText.trim() || !roomId) return;

    try {
      const messagesRef = collection(db, "support_tickets", roomId, "messages");
      
      await addDoc(messagesRef, {
        text: replyText.trim(),
        senderUid: agentUser?.uid || "unknown_agent",
        senderName: agentUser?.displayName || agentUser?.email || "Agent Console",
        createdAt: serverTimestamp()
      });

      setReplyText(""); // Clear input tray on success
    } catch (error) {
      console.error("❌ Failed to transmit live channel message:", error);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0,
      width: typeof window !== 'undefined' && window.innerWidth < 640 ? '100vw' : '420px',
      backgroundColor: '#022329', borderLeft: '2px solid #1e293b',
      boxShadow: '-10px 0 30px rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

      {/* ✕ Header Component Section */}
      <div style={{ padding: '20px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '9px', backgroundColor: '#FFBF00', color: '#020617', padding: '2px 6px', borderRadius: '4px', fontWeight: 900, fontFamily: 'monospace' }}>
            ACTIVE CONSOLE
          </span>
          <h4 style={{ margin: '4px 0 0 0', color: '#ffffff', fontSize: '15px', fontWeight: 900 }}>Room: {roomId}</h4>
        </div>
        <button 
          type="button" 
          onClick={onClose} // 🎯 Single-click unmount passed straight to parent state
          style={{ backgroundColor: 'transparent', border: '1px solid #334155', color: '#ffffff', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: 900, cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>

      {/* Viewport Render Layout */}
      <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ alignSelf: 'center', backgroundColor: 'rgba(5, 41, 46, 0.4)', border: '1px solid #1e293b', padding: '6px 12px', borderRadius: '8px', width: '100%', boxSizing: 'border-box', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: '#2dd4bf', fontWeight: 700, textTransform: 'uppercase' }}>
            📡 Dedicated Terminal Isolated Tunnel
          </span>
        </div>

        {/* 📦 Linked Asset Counterpart Badge */}
        {ticketData?.product_code && (
          <div style={{ backgroundColor: '#031a1e', border: '1px solid #FFBF00', borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '9px', color: '#FFBF00', textTransform: 'uppercase', display: 'block', fontWeight: 900 }}>Linked Asset Context</span>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#ffffff' }}>XID Chain: #{ticketData.product_code}</span>
            </div>
          </div>
        )}

        {/* 💬 Messages Chat Stream */}
        {messages.map((msg) => {
          const isMe = msg.senderUid === agentUser?.uid;
          return (
            <div key={msg.id} style={{
              alignSelf: isMe ? 'flex-end' : 'flex-start',
              backgroundColor: isMe ? '#FFBF00' : '#05292e',
              border: '1px solid #1e293b', padding: '12px 16px',
              borderRadius: isMe ? '14px 14px 0 14px' : '14px 14px 14px 0',
              maxWidth: '85%'
            }}>
              <span style={{ fontSize: '9px', color: isMe ? '#020617' : '#64748b', fontWeight: 900, display: 'block', marginBottom: '2px' }}>
                {msg.senderName}
              </span>
              <p style={{ margin: 0, fontSize: '13px', color: isMe ? '#020617' : '#ffffff', lineHeight: '1.4', wordBreak: 'break-word' }}>
                {msg.text}
              </p>
            </div>
          );
        })}
      </div>

      {/* 📥 Input Form Action Tray */}
      <div style={{ 
        padding: '20px', 
        borderTop: '1px solid #1e293b', 
        backgroundColor: '#031a1e', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px',
        flexShrink: 0, // 🎯 Prevents the message feed list from squishing this tray out of view
        position: 'sticky',
        bottom: 0
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input  
            type="text"
            placeholder="Transmit message to secure channel..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            style={{ flexGrow: 1, backgroundColor: '#022329', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', color: '#ffffff', fontSize: '13px', outline: 'none' }}
          />
          <button  
            onClick={handleSendMessage}
            style={{ backgroundColor: '#FFBF00', color: '#020617', border: 'none', borderRadius: '10px', padding: '0 16px', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            Send ⚡
          </button>
        </div>
      </div>
    </div>
  );
};
