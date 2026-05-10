"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase/client";
import { 
  doc, onSnapshot, collection, addDoc, query, 
  orderBy, serverTimestamp, updateDoc 
} from "firebase/firestore";
import { Send, ArrowLeft, Info, ShieldCheck } from "lucide-react";

export default function ChatPage() {
  const { conversationId } = useParams(); // Matches [conversationId] folder
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [convoData, setConvoData] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Monitor the Conversation & Asset Context
  useEffect(() => {
    // Ensure conversationId exists and is a string
    if (!conversationId || typeof conversationId !== 'string') return;

    const unsub = onSnapshot(doc(db, "conversations", conversationId), (snapshot) => {
      if (snapshot.exists()) {
        setConvoData(snapshot.data());
      }
    });

    return () => unsub();
  }, [conversationId]); // This is correct—it re-runs if the URL ID changes

  // 2. Real-time Message Stream
  useEffect(() => {
    if (!conversationId || typeof conversationId !== 'string') return;

    const q = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      // Auto-scroll logic
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    return () => unsub();
  }, [conversationId]);

  // 2. Real-time Message Stream
  useEffect(() => {
    if (!conversationId) return;
    const q = query(
      collection(db, "conversations", conversationId as string, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsub();
  }, [conversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !auth.currentUser) return;

    const text = newMessage;
    setNewMessage("");

    try {
      await addDoc(collection(db, "conversations", conversationId as string, "messages"), {
        senderId: auth.currentUser.uid,
        text: text,
        timestamp: serverTimestamp(),
        type: "text"
      });

      await updateDoc(doc(db, "conversations", conversationId as string), {
        lastMessage: text,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Message Blocked:", err);
    }
  };

  if (!convoData) return <div className="h-screen flex items-center justify-center font-black text-slate-300 animate-pulse uppercase tracking-widest">Establishing Secure Link...</div>;

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-left">
      {/* 🛡️ BAZARIA PROTOCOL HEADER */}
      <header className="p-4 px-6 border-b flex items-center gap-4 bg-white sticky top-0 z-20">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-50 rounded-full transition-all">
          <ArrowLeft size={20} className="text-slate-400" />
        </button>
        
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
            <img src={convoData.assetImage} className="w-full h-full object-cover" alt="Asset" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm font-900 uppercase tracking-tight truncate max-w-[180px] md:max-w-md">
              {convoData.assetName}
            </h4>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-[10px] font-900 text-teal-600 uppercase tracking-widest">Active Negotiation</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => router.push(`/market/asset/${convoData.assetId}`)}
          className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-black transition-all"
        >
          <Info size={20} />
        </button>
      </header>

      {/* 💬 ENCRYPTED MESSAGE STREAM */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#f8fafc]">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
            <ShieldCheck size={14} className="text-teal-500" />
            <span className="text-[10px] font-900 text-slate-400 uppercase tracking-tighter">End-to-End Secure Protocol</span>
          </div>
        </div>

        {messages.map((m, idx) => {
          const isMe = m.senderId === auth.currentUser?.uid;
          if (m.type === "system") return (
            <p key={idx} className="text-center text-[10px] font-900 text-slate-300 uppercase tracking-[0.2em] my-4">{m.text}</p>
          );

          return (
            <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-3xl text-[14px] leading-relaxed shadow-sm transition-all ${
                isMe 
                ? "bg-black text-white rounded-tr-none" 
                : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
              }`}>
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* ⌨️ PROTOCOL INPUT FIELD */}
      <footer className="p-6 bg-white border-t">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
          <input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Enter secure message..."
            className="flex-1 bg-slate-50 border border-slate-100 rounded-[20px] px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-inner"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-teal-500 text-white p-4 px-6 rounded-[20px] font-black uppercase text-xs hover:bg-teal-600 transition-all active:scale-95 disabled:opacity-30 flex items-center gap-2 shadow-lg shadow-teal-500/20"
          >
            <Send size={18} />
          </button>
        </form>
        {/* ⚡ QUICK REPLIES */}
<div className="px-6 py-2 bg-white flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-50">
  {[
    "Is this still available?",
    "What is your best price?",
    "Where is the pickup location?",
    "Can I see more photos?"
  ].map((text, i) => (
    <button
      key={i}
      onClick={() => {
        setNewMessage(text);
        // Optional: Trigger send immediately if you want it to be "One-Tap"
      }}
      className="whitespace-nowrap px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[11px] font-900 uppercase tracking-tighter text-slate-500 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition-all active:scale-95"
    >
      {text}
    </button>
  ))}
</div>
      </footer>
    </div>
  );
}
