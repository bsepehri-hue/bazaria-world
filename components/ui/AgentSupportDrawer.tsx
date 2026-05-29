"use strict";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, collection, onSnapshot, query, addDoc, serverTimestamp } from "firebase/firestore";

interface AgentSupportDrawerProps {
  roomId: string;
  onClose: () => void;
  agentUser: any;
}

export const AgentSupportDrawer: React.FC<AgentSupportDrawerProps> = ({ roomId, onClose, agentUser }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [ticketData, setTicketData] = useState<any>(null);
  const [replyText, setReplyText] = useState<string>("");

  // 📡 Realtime Synchronizer Pipeline
  useEffect(() => {
    if (!roomId) return;

    console.log(`🔌 [AGENT CONSOLE TUNNEL] Connecting to Room: ${roomId}`);
    
    const ticketDocRef = doc(db, "support_tickets", roomId);
    const unsubTicket = onSnapshot(ticketDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        console.log("📊 Ticket Meta Sync Data:", data);
        setTicketData(data);
      }
    });

    const messagesRef = collection(db, "support_tickets", roomId, "messages");
    const qMessages = query(messagesRef);
    const unsubChat = onSnapshot(qMessages, (snapshot) => {
      const msgs = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      
      msgs.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
      setMessages(msgs);
    });

    return () => {
      console.log(`🧼 [AGENT CONSOLE TEARDOWN] Severing streams for Room: ${roomId}`);
      unsubTicket();
      unsubChat();
    };
  }, [roomId]);

  // ⚡ Message Dispatcher
  const handleSendMessage = async () => {
    if (!replyText.trim() || !roomId) return;

    try {
      const messagesRef = collection(db, "support_tickets", roomId, "messages");
      
      await addDoc(messagesRef, {
        text: replyText.trim(),
        senderUid: agentUser?.uid || "agent_console_node",
        senderName: agentUser?.displayName || agentUser?.email || "Babak Sepehri",
        createdAt: serverTimestamp()
      });

      setReplyText("");
    } catch (error) {
      console.error("❌ Message Transmission Refused:", error);
    }
  };

  const formatXid = (code: string) => {
    const upper = code.toUpperCase();
    return upper.includes("XID-") ? upper : `XID-${upper}`;
  };

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0,
      width: typeof window !== 'undefined' && window.innerWidth < 640 ? '100vw' : '420px',
      backgroundColor: '#022329', borderLeft: '2px solid #1e293b',
      boxShadow: '-10px 0 30px rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif',
      animation: 'slideIn 0.3s ease-out', boxSizing: 'border-box'
    }}>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

      {/* Header Panel */}
      <div style={{ padding: '20px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '9px', backgroundColor: '#FFBF00', color: '#020617', padding: '2px 6px', borderRadius: '4px', fontWeight: 900, fontFamily: 'monospace' }}>
              ACTIVE CONSOLE
            </span>
            {/* ⭐ Dynamic Score Integrator Check */}
            {(ticketData?.rating || ticketData?.stars || ticketData?.score) && (
              <span style={{ fontSize: '11px', color: '#FFBF00', fontWeight: 900, fontFamily: 'monospace' }}>
                ★ {ticketData.rating || ticketData.stars || ticketData.score}/5
              </span>
            )}
          </div>
          <h4 style={{ margin: '4px 0 0 0', color: '#ffffff', fontSize: '14px', fontWeight: 900, fontFamily: 'monospace' }}>
            {roomId}
          </h4>
        </div>
        <button 
          type="button" 
          onClick={onClose} 
          style={{ backgroundColor: 'transparent', border: '1px solid #334155', color: '#ffffff', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: 900, cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>

      {/* Viewport Message Tracker Shell */}
      <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ backgroundColor: 'rgba(5, 41, 46, 0.4)', border: '1px solid #1e293b', padding: '6px 12px', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: '#2dd4bf', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            📡 Dedicated Terminal Isolated Tunnel
          </span>
        </div>

        {/* 📦 Clickable Interactive Asset Badge */}
        {ticketData?.product_code && (
          <div 
            onClick={() => {
              const target = ticketData.product_code.toLowerCase();
              window.open(`/market?q=${encodeURIComponent(target)}`, '_blank');
            }}
            style={{ 
              backgroundColor: '#031a1e', border: '1px solid #FFBF00', borderRadius: '10px', padding: '12px', 
              display: 'flex', flexDirection: 'column', gap: '2px', cursor: 'pointer', transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#05292e'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#031a1e'}
          >
            <span style={{ fontSize: '9px', color: '#FFBF00', textTransform: 'uppercase', fontWeight: 900 }}>Linked Asset Context (Click to Inspect) 🔍</span>
            <span style={{ fontSize: '13px', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>XID Chain: #{formatXid(ticketData.product_code)}</span>
          </div>
        )}

        {/* 💬 Totally Flat Stream (Completely matches user side style formatting) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages
            .filter(msg => msg.text && msg.text !== ticketData?.product_code) // Filters out the rogue XID data bubble
            .map((msg) => {
              const isMe = msg.senderUid === agentUser?.uid || msg.senderName === "Babak Sepehri";
              return (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <span style={{ fontSize: '10px', color: isMe ? '#FFBF00' : '#2dd4bf', fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '2px' }}>
                    {msg.senderName || (isMe ? "Agent" : "Client")}
                  </span>
                  <p style={{ margin: 0, fontSize: '13px', color: '#ffffff', lineHeight: '1.5', wordBreak: 'break-word' }}>
                    {msg.text}
                  </p>
                </div>
              );
          })}
        </div>
      </div>

      {/* 📥 Fixed Input Form Action Tray */}
      <div style={{ padding: '20px', borderTop: '1px solid #1e293b', backgroundColor: '#031a1e', display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
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
