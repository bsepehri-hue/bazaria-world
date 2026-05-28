"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperPlane, FaMagic } from "react-icons/fa";
import { db, auth } from "@/lib/firebase/client";
// 🎯 UPDATED: Added addDoc and serverTimestamp for streaming broadcast writes
import { collection, getDocs, limit, query, addDoc, serverTimestamp, doc, setDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { createLineageBlock, getProductCode, generateXid } from "@/lib/utils";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function AIConciergeDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [marketplaceContext, setMarketplaceContext] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  
  // 🎟️ Support & Routing States
  const [isSupportMode, setIsSupportMode] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<"idle" | "submitting" | "submitted">("idle");
  const [requestType, setRequestType] = useState<"sales" | "admin">("sales");
  const [customSubject, setCustomSubject] = useState("");

  // 🔍 Autocomplete Search States
  const [assetSearch, setAssetSearch] = useState("");
  const [selectedAssetObject, setSelectedAssetObject] = useState<any | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // 🧬 Set Dynamic Cognitive Greeting based on the Active Workspace
  useEffect(() => {
    const isRewardsPath = typeof window !== "undefined" && window.location.pathname.includes("/rewards");
    
    const initialText = isRewardsPath
      ? `Greetings, Success Partner. I am your Operations Concierge. Your active agent workbench is synced. How can I assist you with analyzing your yield projections, tracing an X-ID lineage, or managing active pool leads today?`
      : `Greetings, I am your Bazaria AI Concierge. How may I guide you through our sovereign marketplace, active assets, or storefront setup today?`;

    setMessages([{ sender: "ai", text: initialText }]);
  }, []);

// 🔄 Reactive Session Sync: Only restore if the drawer is explicitly open!
  useEffect(() => {
    if (!isOpen) return; // 🛡️ GUARD: Stop background background scripts from double-binding

    const activeTicketId = localStorage.getItem("bazaria_active_ticket");
    if (activeTicketId) {
      console.log("♻️ Found active ticket session, restoring stream channel:", activeTicketId);
      setTicketStatus("submitted");
      if (typeof setIsSupportMode === "function") {
        setIsSupportMode(true);
      }
    }
  }, [isOpen, setIsSupportMode]); // Track isOpen reactively
  
  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Auth state listener to identify who is opening the support ticket
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  // 📡 Live Stream Support Thread directly into Client UI View (REACTIVE ENGINE)
  useEffect(() => {
    // 🎯 FIX: Track a state variable or read freshly from storage reactively
    const activeTicketId = localStorage.getItem("bazaria_active_ticket");
    
    // If the client hasn't broadcasted a ticket yet in this drawer session, keep waiting
    if (!activeTicketId) return;

    console.log(`🔌 Client AI Drawer actively syncing live stream: /support_tickets/${activeTicketId}/messages`);
    
    const messagesRef = collection(db, "support_tickets", activeTicketId, "messages");
    
    // Query sorted directly by our chronological standard ISO timestamp
    const qMessages = query(messagesRef);

    const unsubscribe = onSnapshot(qMessages, (snapshot) => {
      if (!snapshot.empty) {
        const liveMsgs = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          
          // Align incoming Firestore senders to UI layout expectations
          let resolvedSender = data.sender;
          if (data.sender === "client" || data.senderUid === user?.uid) {
            resolvedSender = "user";
          } else if (data.sender === "agent" || data.isAgent) {
            resolvedSender = "agent";
          }

          return {
            sender: resolvedSender,
            text: data.text || ""
          };
        });

        // Retain the system welcome text message at index 0 and append live agent/client logs
        setMessages(prev => {
          const safePrev = Array.isArray(prev) && prev.length > 0 ? [prev[0]] : [];
          return [...safePrev, ...liveMsgs];
        });
      }
    }, (error) => {
      console.error("Client support live sync failed:", error);
    });

    return () => unsubscribe();
    
    // 🎯 TRIGGER RE-BINDING: Re-run this listener as soon as ticketStatus shifts to "submitted"!
  }, [user?.uid, ticketStatus]);
  // Close suggestions overlay if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 📡 Listen for Global Sidebar "Support" clicks to open this drawer automatically
  useEffect(() => {
    const handleGlobalOpen = (event: Event) => {
      try {
        const customEvent = event as CustomEvent;
        console.log("🔥 AIConciergeDrawer received click event! Raw detail:", customEvent.detail);
        
        // 1. Force the layout block to visible immediately
        setIsOpen(true);
        
        // ⚡ Pull the active viewport asset from global memory tracks safely
        const globalViewportXID = typeof window !== "undefined" ? (window as any).__ACTIVE_VIEWPORT_XID__ : "";
        const globalViewportObj = typeof window !== "undefined" ? (window as any).__ACTIVE_VIEWPORT_OBJ__ : null;

        console.log("🔍 Diagnostic window state dump:", { globalViewportXID, globalViewportObj });

        // If a global tracker exists, synchronize both inputs instantly!
        if (globalViewportXID) {
          const standardXID = globalViewportXID.startsWith("XID-") 
            ? globalViewportXID.toUpperCase() 
            : `XID-${globalViewportXID.toUpperCase()}`;

          if (typeof setAssetSearch === "function") setAssetSearch(standardXID);
          if (typeof setInput === "function") setInput(`Inquiry regarding Asset Ref: ${standardXID} - `);

          if (globalViewportObj) {
            if (typeof setSelectedAssetObject === "function") setSelectedAssetObject(globalViewportObj);
          } else {
            if (typeof setSelectedAssetObject === "function") {
              setSelectedAssetObject({ id: standardXID, title: `Asset ${standardXID}` });
            }
          }
        }

        // 2. Safely unpack support mode routing state parameters
        const isSupport = customEvent.detail?.mode === "support";
        if (isSupport && typeof setIsSupportMode === "function") {
          setIsSupportMode(true);
          
          if (typeof setMessages === "function") {
            setMessages(prev => {
              // Handle potential empty/undefined initial message arrays safely
              const safePrev = Array.isArray(prev) ? prev : [];
              if (safePrev.some(m => m?.text?.includes("support array"))) return safePrev;
              return [
                ...safePrev,
                {
                  sender: "ai",
                  text: "System Alert: I have routed your query to our support array. If your task requires human oversight, you can request a Live Listing Agent at any time using the console panel below."
                }
              ];
            });
          }
        }
        
        console.log("✅ AIConciergeDrawer finished opening phase successfully.");
      } catch (err) {
        console.error("❌ CRITICAL: AIConciergeDrawer crashed inside the open handler loop:", err);
      }
    };

    window.addEventListener("open-ai-concierge", handleGlobalOpen);
    return () => window.removeEventListener("open-ai-concierge", handleGlobalOpen);
  }, [setIsOpen, setIsSupportMode, setAssetSearch, setInput, setSelectedAssetObject, setMessages]);
  
  // Load active listings to feed into autocomplete and AI
  useEffect(() => {
    const fetchContext = async () => {
      try {
        const q = query(collection(db, "listings"), limit(25));
        const snap = await getDocs(q);
        const activeItems = snap.docs.map(docSnap => {
          const data = docSnap.data();
          
          // 🎯 AUTO-CONVERTER: If the document lacks a 5-digit field, we take the document ID
          const fallbackXID = docSnap.id.substring(0, 5).toUpperCase();
          const cleanXID = data.product_code || data.xid || fallbackXID;

          return {
            id: docSnap.id, 
            product_code: cleanXID, 
            title: data.title || "Unknown Asset",
            price: data.price || 0,
            category: data.category || "Asset"
          };
        });
        setMarketplaceContext(activeItems);
      } catch (err) {
        console.error("AI Concierge Context Loader failed:", err);
      }
    };
    fetchContext();
  }, []);

  // 📡 MULTI-TENANT LEAD BROADCAST ROUTINE (⚡ SAFELY INSIDE COMPONENT SCOPE!)
  const handleBroadcastLead = async () => {
    try {
      // 🎯 1. Dynamically capture the correct message payload depending on the selected triage path
      const activeMessagePayload = requestType === "sales" ? assetSearch : customSubject;

      // 🛡️ Safety Validation: Block empty submissions from generating blank Firestore rows
      if (!activeMessagePayload.trim()) {
        alert("Please provide asset details or inquiry text before attempting to broadcast.");
        return;
      }

      setTicketStatus("submitting");

      const resolvedCountry = "US";
      const shortId = Math.floor(100000 + Math.random() * 900000);
      const generatedTicketId = `tkt_gen_${shortId}`;

      // 🎯 FORCE CLEAN FALLBACK CODES TO PREVENT UNDEFINED CRASHES
      let extractedProductCode = "GENERAL";
      let finalSubjectText = "Technical Assistance";

      if (requestType === "sales" && selectedAssetObject) {
        const docIdFallback = selectedAssetObject.id ? selectedAssetObject.id.substring(0, 5).toUpperCase() : "ASSET";
        extractedProductCode = selectedAssetObject.product_code || selectedAssetObject.xid || docIdFallback;
        finalSubjectText = selectedAssetObject.title || "Sales Inquiry";
      } else if (requestType === "admin") {
        extractedProductCode = "ADMIN";
        finalSubjectText = customSubject || "Admin Support Request";
      }

      // ⚡ THE SMOKING GUN FIX UPGRADED: Scan the actual message body string for full or raw codes!
      const messageBodyString = (activeMessagePayload || "").trim();
      
      // Pattern 1: Look for full structured markers (e.g., XID-EZK65, PRD-12345)
      const structuredMatch = messageBodyString.match(/XID-[A-Z0-9]{5}/i) || messageBodyString.match(/PRD-[A-Z0-9]{5}/i);
      
      if (structuredMatch) {
        extractedProductCode = structuredMatch[0].toUpperCase();
        finalSubjectText = `Asset Inquiry: ${extractedProductCode}`;
      } 
      // Pattern 2: If they just typed/pasted a raw 5-digit code (e.g., EZK65), normalize it automatically!
      else if (/^[A-Z0-9]{5}$/i.test(messageBodyString) && extractedProductCode !== "ADMIN") {
        extractedProductCode = `XID-${messageBodyString.toUpperCase()}`;
        finalSubjectText = `Asset Inquiry: ${extractedProductCode}`;
      }
      // Pattern 3: If it's a fallback string length that looks like a raw code but has messy characters
      else if (messageBodyString.toUpperCase().replace("XID-", "").replace("#", "").trim().length === 5 && extractedProductCode !== "ADMIN") {
        const absoluteClean = messageBodyString.toUpperCase().replace("XID-", "").replace("#", "").trim();
        extractedProductCode = `XID-${absoluteClean}`;
        finalSubjectText = `Asset Inquiry: ${extractedProductCode}`;
      }

      // 🧼 THE SCISSORS: Ensure formatting is balanced and doesn't pass raw 5-digit characters naked
      if (extractedProductCode && extractedProductCode !== "GENERAL" && extractedProductCode !== "ADMIN") {
        if (!extractedProductCode.startsWith("XID-") && extractedProductCode.length === 5) {
          extractedProductCode = `XID-${extractedProductCode.toUpperCase()}`;
        }
      }

      const buyerUserXID = user ? `USR-${user.uid}` : "USR-ANONYMOUS";

      // 1️⃣ Ensure your payload configuration includes the standard data identifiers:
      const newTicketPayload = {
        ticketId: generatedTicketId,
        product_code: extractedProductCode.toUpperCase(), 
        subject: finalSubjectText, 
        message: activeMessagePayload, 
        lastMessage: activeMessagePayload, 
        customer_id: user?.uid || "ANONYMOUS",
        customer_name: user?.displayName || "Citizen",
        customer_email: user?.email || "anonymous@bazaria.world",
        buyerXid: buyerUserXID,
        countryCode: resolvedCountry || "US", 
        request_type: requestType,
        status: "open",
        transcript: messages.map(m => `${m.sender.toUpperCase()}: ${m.text}`),
        created_at: new Date().toISOString(),
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      };

      console.log("🚀 Broadcasting ticket payload to cloud storage with XID context:", newTicketPayload);

// 🕵️‍♂️ DIAGNOSTIC LINE: Let's look at what keys are actually inside this object right now
      console.log("DEBUG: WHAT IS INSIDE THIS PAYLOAD?", {
        type: typeof newTicketPayload,
        keys: newTicketPayload ? Object.keys(newTicketPayload) : "none",
        raw: newTicketPayload
      });

      // 🎯 UNIFIED MATRIX REALIGNMENT: 
      // Force Firestore to name the folder node using our exact string ID instead of a random hash!
      const unifiedTicketDocRef = doc(db, "support_tickets", generatedTicketId);
      await setDoc(unifiedTicketDocRef, newTicketPayload);
      console.log(`✅ Ticket successfully initialized directly on path: /support_tickets/${generatedTicketId}`);

      // Feed the initial inquiry message text directly into the subcollection pipeline 
      const firstMessageRef = collection(db, "support_tickets", generatedTicketId, "messages");
      await addDoc(firstMessageRef, {
        text: activeMessagePayload,
        sender: "client",
        isAgent: false,
        createdAt: serverTimestamp(),
        timestamp: new Date().toISOString()
      });
      console.log("✅ Initial customer inquiry text synced to subcollection.");

      // Lock your browser storage trackers onto the same ID
      localStorage.setItem("bazaria_active_ticket", generatedTicketId);
      window.dispatchEvent(new Event("new-ticket-created"));
      console.log("🎯 Client session locked onto channel:", generatedTicketId);

      setTicketStatus("submitted");

    } catch (error) {
      console.error("❌ Critical error inside lead broadcast routine:", error);
      setTicketStatus("idle");
    }
  };

  // 🔍 Filter listings based on what the user types using the exact unified layout tag format
  const filteredAssets = marketplaceContext.filter(asset => {
    const searchClean = assetSearch.toUpperCase().trim();
    const fallbackToken = asset.id ? asset.id.substring(0, 5).toUpperCase() : "";
    const cleanRawXid = (asset.product_code || fallbackToken).toUpperCase();
    const fullFormattedXID = `XID-${cleanRawXid}`;
    const titleLower = asset.title.toLowerCase();

    return (
      titleLower.includes(assetSearch.toLowerCase()) ||
      fullFormattedXID.includes(searchClean) ||
      cleanRawXid.includes(searchClean)
    );
  });

  // 🤖 THE ASYNCHRONOUS SEND MESSAGE ROUTINE
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
          context: marketplaceContext
        })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        sender: "ai", 
        text: data.reply || "My cognitive links are temporarily disrupted. Please try again." 
      }]);
    } catch (error) {
      console.error("AI Concierge Error:", error);
      setMessages(prev => [...prev, { sender: "ai", text: "Communication link offline. Check your API route." }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <>
      {/* 🏷️ TRIGGER TAB */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            right: 0,
            top: "45%",
            transform: "translateY(-50%)",
            backgroundColor: "#05292e",
            color: "#FFBF00",
            border: "1px solid #FFBF00",
            borderRight: "none",
            borderRadius: "12px 0 0 12px",
            padding: "16px 12px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            zIndex: 999,
            boxShadow: "-4px 4px 12px rgba(0,0,0,0.15)",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => e.currentTarget.style.paddingRight = "16px"}
          onMouseOut={(e) => e.currentTarget.style.paddingRight = "12px"}
        >
          <FaMagic size={14} style={{ color: "#FFBF00" }} />
          <span style={{ fontSize: "10px", fontWeight: 900, writingMode: "vertical-lr", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            AI CONCIERGE
          </span>
        </button>
      )}

      {/* 🤖 THE FLOATING AI PANEL */}
      <div
        style={{
          position: "fixed",
          right: isOpen ? 0 : "-400px",
          top: 0,
          width: "380px",
          height: "100vh",
          backgroundColor: "#ffffff",
          boxShadow: "-8px 0 24px rgba(5, 41, 46, 0.15)",
          zIndex: 1000,
          transition: "right 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
          borderLeft: "4px solid #05292e"
        }}
      >
        {/* Panel Header */}
        <div style={{ backgroundColor: "#05292e", color: "white", padding: "20px", borderBottom: "4px solid #FFBF00", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaMagic style={{ color: "#FFBF00" }} size={16} />
            <div>
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 900, letterSpacing: "1px", textTransform: "uppercase" }}>AI Concierge</h4>
              <span style={{ fontSize: "9px", color: isSupportMode ? "#ff4d4d" : "#FFBF00", fontWeight: "bold", letterSpacing: "1px" }}>
                {isSupportMode ? "SUPPORT PROTOCOL ROUTED" : "COGNITIVE SYSTEM ACTIVE"}
              </span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "16px" }}>
            <FaTimes />
          </button>
        </div>

        {/* Message Stream */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "#f8fafc" }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                backgroundColor: msg.sender === "user" ? "#05292e" : "#ffffff",
                color: msg.sender === "user" ? "#ffffff" : "#1e293b",
                padding: "12px 16px",
                borderRadius: msg.sender === "user" ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
                fontSize: "13px",
                lineHeight: "1.5",
                border: msg.sender === "ai" ? "1px solid #e2e8f0" : "none"
              }}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: "flex-start", backgroundColor: "#ffffff", padding: "12px 16px", borderRadius: "16px 16px 16px 2px", border: "1px solid #e2e8f0", display: "flex", gap: "4px" }}>
              <span style={{ width: "6.5px", height: "6.5px", backgroundColor: "#05292e", borderRadius: "50%", display: "inline-block", animation: "bounce 1s infinite" }}></span>
              <span style={{ width: "6.5px", height: "6.5px", backgroundColor: "#05292e", borderRadius: "50%", display: "inline-block", animation: "bounce 1s infinite 0.2s" }}></span>
              <span style={{ width: "6.5px", height: "6.5px", backgroundColor: "#05292e", borderRadius: "50%", display: "inline-block", animation: "bounce 1s infinite 0.4s" }}></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

       {/* 🤝 SPECIAL: Dynamic Support Router Area */}
{isSupportMode && (
  <div style={{ padding: "16px 20px", backgroundColor: "#fff8e6", borderTop: "1px solid #ffeeba", display: "flex", flexDirection: "column", gap: "12px" }}>
    
    {/* ─── STAGE 1 & 2: INITIAL SETUP & ROUTINGdepartment FORM ─── */}
    {ticketStatus !== "submitted" && (
      <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: "bold", color: "#856404" }}>
            Live Assistance Router
          </span>
          <button 
            type="button"
            onClick={() => {
              // 🧼 THE DISINFECTANT: Wipe storage so the auto-restore effect won't latch back onto it!
              localStorage.removeItem("bazaria_active_ticket");
              
              setIsSupportMode(false);
              setTicketStatus("idle");
              setAssetSearch("");
              if (typeof setSelectedAssetObject === "function") {
                setSelectedAssetObject(null);
              }
            }}
            style={{ background: "none", border: "none", fontSize: "10px", color: "#856404", cursor: "pointer", textDecoration: "underline" }}
          >
            Return to AI Menu
          </button>
        </div>

        {ticketStatus === "idle" && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();   
              handleBroadcastLead(); 
            }} 
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {/* Department Router Selector Buttons */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setRequestType("sales")}
                style={{
                  flex: 1, padding: "6px", borderRadius: "6px", fontSize: "10px", fontWeight: "bold", cursor: "pointer",
                  border: requestType === "sales" ? "2px solid #05292e" : "1px solid #cbd5e1",
                  backgroundColor: requestType === "sales" ? "#05292e" : "#ffffff",
                  color: requestType === "sales" ? "#FFBF00" : "#475569"
                }}
              >
                🤝 Sales & Assets
              </button>
              <button
                type="button"
                onClick={() => setRequestType("admin")}
                style={{
                  flex: 1, padding: "6px", borderRadius: "6px", fontSize: "10px", fontWeight: "bold", cursor: "pointer",
                  border: requestType === "admin" ? "2px solid #05292e" : "1px solid #cbd5e1",
                  backgroundColor: requestType === "admin" ? "#05292e" : "#ffffff",
                  color: requestType === "admin" ? "#FFBF00" : "#475569"
                }}
              >
                ⚙️ Tech & Admin
              </button>
            </div>

            {/* 📁 TRACK A: SALES DEPARTMENT INPUT */}
            {requestType === "sales" && (
              <div ref={suggestionRef} style={{ position: "relative" }}>
                <label style={{ fontSize: "9px", fontWeight: "bold", color: "#856404", display: "block", marginBottom: "4px" }}>
                  Which listing are you inquiring about?
                </label>
                <input
                  type="text"
                  placeholder="Type or paste XID... (e.g., XID-EZK65)"
                  value={assetSearch || ""}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    setAssetSearch(rawValue);
                    const structuredToken = rawValue.toUpperCase().includes("XID-") 
                      ? rawValue.toUpperCase().trim() 
                      : `XID-${rawValue.toUpperCase().trim()}`;

                    setSelectedAssetObject({
                      id: rawValue.toUpperCase(),
                      title: rawValue,
                      product_code: structuredToken,
                      xid: structuredToken
                    });
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "11px", boxSizing: "border-box" }}
                />
                
                {/* Autocomplete Dropdown */}
                {showSuggestions && assetSearch.trim().length > 0 && filteredAssets.length > 0 && (
                  <ul style={{ position: "absolute", bottom: "100%", left: 0, width: "100%", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", maxHeight: "130px", overflowY: "auto", margin: "0 0 4px 0", padding: 0, listStyle: "none", zIndex: 1010, boxShadow: "0 -4px 12px rgba(0,0,0,0.1)" }}>
                    {filteredAssets.map((asset, idx) => {
                      const fallbackToken = asset.id ? asset.id.substring(0, 5).toUpperCase() : "";
                      const shortCode = `XID-${(asset.product_code || fallbackToken).toUpperCase()}`;
                      return (
                        <li
                          key={idx}
                          onClick={() => {
                            setAssetSearch(shortCode);
                            setSelectedAssetObject({ ...asset, product_code: shortCode });
                            setShowSuggestions(false);
                          }}
                          style={{ padding: "8px 12px", fontSize: "11px", cursor: "pointer", borderBottom: "1px solid #f1f5f9", color: "#1e293b", textAlign: "left" }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <b style={{ color: "#05292e" }}>{asset.title}</b> 
                              {asset.price && <span style={{ fontSize: "10px", color: "#0d9488", marginLeft: "6px", fontWeight: "bold" }}>${asset.price.toLocaleString()}</span>}
                            </div>
                            <span style={{ fontSize: "9px", backgroundColor: "#f1f5f9", color: "#475569", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace", fontWeight: "bold" }}>#{shortCode}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}

            {/* 📁 TRACK B: TECH & ADMIN DEPARTMENT INPUT */}
            {requestType === "admin" && (
              <div>
                <label style={{ fontSize: "9px", fontWeight: "bold", color: "#856404", display: "block", marginBottom: "4px" }}>
                  What technical or administrative issue are you facing?
                </label>
                <input
                  type="text"
                  placeholder="e.g., Wallet Connect Error, Profile Update Bug"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "11px", boxSizing: "border-box" }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={ticketStatus === "submitting"}
              style={{
                width: "100%", padding: "10px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", transition: "opacity 0.2s",
                backgroundColor: ticketStatus === "submitting" ? "#cbd5e1" : "#05292e", 
                color: ticketStatus === "submitting" ? "#475569" : "#FFBF00",
                border: "1px solid #FFBF00",
                cursor: ticketStatus === "submitting" ? "not-allowed" : "pointer",
              }}
            >
              Confirm & Broadcast Lead 📡
            </button>
          </form>
        )}

        {/* STAGE 2: Pending Broadcast State */}
        {ticketStatus === "submitting" && (
          <div style={{ fontSize: "11px", color: "#856404", fontStyle: "italic", textAlign: "center", padding: "12px" }}>
            Broadcasting matrix signal to agent array... 📡
          </div>
        )}
      </>
    )}

    {/* ─── STAGE 3: ISOLATED LIVE SUPPORT CHAT TRAY PANEL ─── */}
    {ticketStatus === "submitted" && (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        
        {/* Dynamic Connected Banner Badge */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          backgroundColor: requestType === "admin" ? "#f1f5f9" : "#d4edda", 
          border: requestType === "admin" ? "1px solid #cbd5e1" : "1px solid #c3e6cb",
          color: requestType === "admin" ? "#334155" : "#155724", 
          padding: "6px 12px", 
          borderRadius: "6px", 
          fontSize: "10px", 
          fontWeight: "bold" 
        }}>
          <span>
            {requestType === "admin" ? "⚙️ ADMIN CORE TERMINAL CONNECTED" : "🚀 SALES WIRELESS CHANNEL ACTIVE"}
          </span>
          <span style={{ fontFamily: "monospace", opacity: 0.8 }}>
            {localStorage.getItem("bazaria_active_ticket") || "CONNECTED"}
          </span>
        </div>
        
        {/* Isolated Stage 3 Message Submission Field */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const clientInputText = (e.currentTarget.elements.namedItem("clientMessage") as HTMLInputElement).value;
            if (!clientInputText.trim()) return;

            const activeTicketId = localStorage.getItem("bazaria_active_ticket");
            if (!activeTicketId) return;

            try {
              const msgSubcollectionRef = collection(db, "support_tickets", activeTicketId, "messages");
              await addDoc(msgSubcollectionRef, {
                text: clientInputText.trim(),
                sender: "client",
                isAgent: false,
                createdAt: serverTimestamp(),
                timestamp: new Date().toISOString()
              });

              const parentDocRef = doc(db, "support_tickets", activeTicketId);
              await setDoc(parentDocRef, {
                lastMessage: clientInputText.trim(),
                updatedAt: serverTimestamp()
              }, { merge: true });

              (e.target as HTMLFormElement).reset();
            } catch (err) {
              console.error("Outbound text tray transmission dropped:", err);
            }
          }}
          style={{ display: "flex", gap: "8px", alignItems: "center" }}
        >
          <input
            name="clientMessage"
            type="text"
            placeholder={requestType === "admin" ? "Message system admin..." : "Type a message to the agent..."}
            required
            style={{
              flex: 1, padding: "10px 14px", borderRadius: "20px", border: "1px solid #cbd5e1",
              fontSize: "13px", outline: "none", boxSizing: "border-box"
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#05292e", color: "#FFBF00", border: "none",
              width: "36px", height: "36px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyKey: "center", justifyContent: "center", cursor: "pointer", fontSize: "14px"
            }}
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    )}
  </div>
)}

      {/* 🛡️ GUARD LAYER START: Completely hides baseline AI elements when live human support is active */}
        {!isSupportMode && (
          <>
            {/* Suggestion Prompt Chips */}
            <div style={{ padding: "10px 20px", backgroundColor: "#ffffff", display: "flex", gap: "8px", overflowX: "auto", borderTop: "1px solid #f1f5f9" }}>
              <button 
                onClick={() => suggestPrompt("Are there any premium assets available?")}
                style={{ padding: "6px 12px", backgroundColor: "#f1f5f9", border: "none", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", color: "#475569", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                🔍 Browse Assets
              </button>
              <button 
                onClick={() => suggestPrompt("How do I establish a storefront?")}
                style={{ padding: "6px 12px", backgroundColor: "#f1f5f9", border: "none", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", color: "#475569", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                🏪 Create Storefront
              </button>
            </div>

            {/* Native AI Concierge Input Box (Moved Inside Guard) */}
            <form onSubmit={handleSendMessage} style={{ padding: "20px", backgroundColor: "#ffffff", borderTop: "1px solid #e2e8f0", display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Consult the Concierge..."
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "24px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none"
                }}
              />
              <button
                type="submit"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#05292e",
                  color: "#FFBF00",
                  border: "1px solid #FFBF00",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                <FaPaperPlane size={12} />
              </button>
            </form>
          </>
        )}
        {/* 🛡️ GUARD LAYER END */}

      </div>
    </>
  );
}
