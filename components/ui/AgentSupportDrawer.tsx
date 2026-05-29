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

  useEffect(() => {
    if (!roomId) return;

    console.log(`🔌 [AGENT CONSOLE TUNNEL] Connecting to Room: ${roomId}`);
    
    const ticketDocRef = doc(db, "support_tickets", roomId);
    const unsubTicket = onSnapshot(ticketDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setTicketData(snapshot.data());
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

  // ⚡ Message Dispatcher inside AgentSupportDrawer.tsx
  const handleSendMessage = async () => {
    if (!replyText.trim() || !roomId) return;

    try {
      const messagesRef = collection(db, "support_tickets", roomId, "messages");
      
     await addDoc(messagesRef, {
        text: replyText.trim(),
        sender: "agent",
        senderUid: agentUser?.uid || "agent_console_node",
        senderName: agentUser?.displayName || "Babak Sepehri",
        // 🎯 STAMP YOUR REAL AVATAR: Replace this string link with your actual image asset URL if you have one uploaded, or keep a sharp, dedicated placeholder!
        senderPhoto: agentUser?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80", 
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

  const currentRating = ticketData?.rating || ticketData?.stars || ticketData?.score || ticketData?.ratingValue;

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

      {/* 👤 PREMIUM AVATAR HEADER PANEL */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#031a1e', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={agentUser?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
              alt="Agent Avatar"
              style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #FFBF00', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '10px', height: '10px', backgroundColor: '#2dd4bf', borderRadius: '50%', border: '2px solid #031a1e' }} />
          </div>
          <div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '9px', backgroundColor: '#FFBF00', color: '#020617', padding: '1px 5px', borderRadius: '4px', fontWeight: 900, fontFamily: 'monospace' }}>
                REWARDS AGENT
              </span>
              {currentRating && (
                <span style={{ fontSize: '10px', color: '#FFBF00', fontWeight: 900, fontFamily: 'monospace' }}>
                  ★ {currentRating}/5
                </span>
              )}
            </div>
            <h4 style={{ margin: '2px 0 0 0', color: '#ffffff', fontSize: '14px', fontWeight: 900 }}>
              {agentUser?.displayName || "Babak Sepehri"}
            </h4>
            <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', display: 'block' }}>Node: {roomId.slice(0, 12)}</span>
          </div>
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
      <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* 📦 Clickable Interactive Asset Badge */}
        {ticketData?.product_code && (
          <div 
            onClick={() => {
              const target = ticketData.product_code.toLowerCase();
              window.open(`/market?q=${encodeURIComponent(target)}`, '_blank');
            }}
            style={{ 
              backgroundColor: 'rgba(5, 41, 46, 0.4)', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', 
              display: 'flex', flexDirection: 'column', gap: '2px', cursor: 'pointer', transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#FFBF00'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1e293b'}
          >
            <span style={{ fontSize: '9px', color: '#2dd4bf', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.5px' }}>Linked Asset Context (Click to Inspect) 🔍</span>
            <span style={{ fontSize: '13px', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>XID: {formatXid(ticketData.product_code)}</span>
          </div>
        )}

        {/* 💬 PREMIUM BUBBLE WORKFLOW */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
          {messages
            .filter(msg => msg.text && msg.text !== ticketData?.product_code && !msg.text.startsWith("XID-"))
            .map((msg) => {
              const isMe = msg.senderUid === agentUser?.uid || msg.senderName === "Babak Sepehri";
              return (
                <div key={msg.id} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '80%'
                }}>
                  <span style={{ fontSize: '9px', color: '#64748b', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '3px', textAlign: isMe ? 'right' : 'left' }}>
                    {isMe ? "You" : msg.senderName}
                  </span>
                  <div style={{
                    backgroundColor: isMe ? '#FFBF00' : '#1e293b',
                    color: isMe ? '#020617' : '#ffffff',
                    padding: '10px 14px',
                    borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    border: isMe ? 'none' : '1px solid #334155'
                  }}>
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.45', wordBreak: 'break-word', fontWeight: isMe ? 600 : 400 }}>
                      {msg.text}
                    </p>
                  </div>
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
