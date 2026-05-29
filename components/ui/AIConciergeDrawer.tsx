"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperPlane, FaMagic } from "react-icons/fa";
import { db, auth } from "@/lib/firebase/client";
import { collection, getDocs, limit, query, addDoc, serverTimestamp, doc, setDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

interface Message {
  sender: "user" | "ai" | "agent";
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
  const [showClosingCeremony, setShowClosingCeremony] = useState<boolean>(false);

  // 🔍 Autocomplete Search States
  const [assetSearch, setAssetSearch] = useState("");
  const [selectedAssetObject, setSelectedAssetObject] = useState<any | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // 🗡️ LIFECYCLE DECAPITATORS: Refs to track and instantly kill background Firebase listeners
  const ticketListenerRef = useRef<(() => void) | null>(null);
  const messagesListenerRef = useRef<(() => void) | null>(null);

  // 🧬 Set Dynamic Cognitive Greeting based on the Active Workspace
  useEffect(() => {
    const isRewardsPath = typeof window !== "undefined" && window.location.pathname.includes("/rewards");
    
    const initialText = isRewardsPath
      ? `Greetings, Success Partner. I am your Operations Concierge. Your active agent workbench is synced. How can I assist you with analyzing your yield projections, tracing an X-ID lineage, or managing active pool leads today?`
      : `Greetings, I am your Bazaria AI Concierge. How may I guide you through our sovereign marketplace, active assets, or storefront setup today?`;

    setMessages([{ sender: "ai", text: initialText }]);
  }, []);

  // 🔄 Strict Session Initialization and Recovery Engine
  useEffect(() => {
    if (!isOpen) return;

    const activeTicketId = localStorage.getItem("bazaria_active_ticket");
    
    if (activeTicketId && activeTicketId !== "undefined" && activeTicketId !== "null" && activeTicketId.trim() !== "") {
      console.log("♻️ Checking real-time database validation for session:", activeTicketId);
      
      const ticketDocRef = doc(db, "support_tickets", activeTicketId);
      
      // Kill any stray listener before spinning a new one
      if (ticketListenerRef.current) ticketListenerRef.current();

      ticketListenerRef.current = onSnapshot(ticketDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const ticketData = snapshot.data();
          
          if (ticketData.status === "closed" || ticketData.status === "resolved") {
            console.log("🏁 Historical session verified as SETTLED on mount. Activating ceremony.");
            setTicketStatus("submitted");
            setIsSupportMode(true);
            setShowClosingCeremony(true);
          } else {
            console.log("🚀 Historical session verified as OPEN/ACTIVE on mount. Launching tray.");
            setTicketStatus("submitted");
            setIsSupportMode(true);
            setShowClosingCeremony(false);
          }
        } else {
          localStorage.removeItem("bazaria_active_ticket");
          setTicketStatus("idle");
          setIsSupportMode(false);
          setShowClosingCeremony(false);
        }
      });

      return () => {
        if (ticketListenerRef.current) {
          ticketListenerRef.current();
          ticketListenerRef.current = null;
        }
      };
    } else {
      console.log("🧼 Clear local cache signature detected. Forcing clean triage setup.");
      setTicketStatus("idle");
      setIsSupportMode(false);
      setShowClosingCeremony(false);
    }
  }, [isOpen]);

  // 🛰️ Real-time Ticket Lifecycle Status Listener
  useEffect(() => {
    if (!isOpen || ticketStatus !== "submitted") return;

    const activeTicketId = localStorage.getItem("bazaria_active_ticket");
    if (!activeTicketId) return;

    const ticketDocRef = doc(db, "support_tickets", activeTicketId);

    if (ticketListenerRef.current) ticketListenerRef.current();

    ticketListenerRef.current = onSnapshot(ticketDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const ticketData = snapshot.data();
        console.log("🛰️ Live Firebase Status Tick:", ticketData.status);
        
        if (ticketData.status === "closed" || ticketData.status === "resolved") {
          console.log("🛑 Agent closed session. Moving full-frame ratings card into window.");
          setShowClosingCeremony(true);
        }
      }
    }, (error) => {
      console.error("Status channel link dropped:", error);
    });

    return () => {
      if (ticketListenerRef.current) {
        ticketListenerRef.current();
        ticketListenerRef.current = null;
      }
    };
  }, [isOpen, ticketStatus]);
  
  // 📡 Live Stream Support Thread directly into Client UI View (REACTIVE ENGINE)
  useEffect(() => {
    if (!isOpen || ticketStatus !== "submitted") return;
    
    const activeTicketId = localStorage.getItem("bazaria_active_ticket");
    if (!activeTicketId) return;

    console.log(`🔌 Syncing message stream subcollection updates for channel: ${activeTicketId}`);
    
    const messagesRef = collection(db, "support_tickets", activeTicketId, "messages");
    const qMessages = query(messagesRef);

    if (messagesListenerRef.current) messagesListenerRef.current();

    messagesListenerRef.current = onSnapshot(qMessages, (snapshot) => {
      if (!snapshot.empty) {
        const sortedDocs = [...snapshot.docs].sort((a, b) => {
          const aTime = a.data().timestamp || "";
          const bTime = b.data().timestamp || "";
          return aTime.localeCompare(bTime);
        });

        const liveMsgs = sortedDocs.map(docSnap => {
          const data = docSnap.data();
          
          let resolvedSender: "user" | "ai" | "agent" = "user";
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

        setMessages(prev => {
          const safePrev = Array.isArray(prev) && prev.length > 0 ? [prev[0]] : [];
          return [...safePrev, ...liveMsgs];
        });
      }
    }, (error) => {
      console.error("Messages sync failed:", error);
    });

    return () => {
      if (messagesListenerRef.current) {
        messagesListenerRef.current();
        messagesListenerRef.current = null;
      }
    };
  }, [user?.uid, ticketStatus, isOpen]);

  // Auto-scroll logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  // Outside click handles for search suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 📡 Global Sidebar Open Trigger Listener Pass
  useEffect(() => {
    const handleGlobalOpen = (event: Event) => {
      try {
        const customEvent = event as CustomEvent;
        console.log("🔥 Global event caught inside listener. Mode parameter:", customEvent.detail?.mode);
        
        // 1️⃣ Slide the drawer window frame open instantly
        setIsOpen(true);
        
        // 2️⃣ Capture marketplace active viewing configurations safely
        const globalViewportXID = typeof window !== "undefined" ? (window as any).__ACTIVE_VIEWPORT_XID__ : "";
        const globalViewportObj = typeof window !== "undefined" ? (window as any).__ACTIVE_VIEWPORT_OBJ__ : null;

        if (globalViewportXID) {
          const standardXID = globalViewportXID.startsWith("XID-") 
            ? globalViewportXID.toUpperCase() 
            : `XID-${globalViewportXID.toUpperCase()}`;

          setAssetSearch(standardXID);
          setInput(`Inquiry regarding Asset Ref: ${standardXID} - `);

          if (globalViewportObj) {
            setSelectedAssetObject(globalViewportObj);
          } else {
            setSelectedAssetObject({ id: standardXID, title: `Asset ${standardXID}` });
          }
        }

        // 3️⃣ 🎯 THE FORCE LOCK: Push UI layout states explicitly into Triage Mode
        const isSupport = customEvent.detail?.mode === "support";
        if (isSupport || !localStorage.getItem("bazaria_active_ticket")) {
          console.log("🎟️ Activating baseline support layout configurations.");
          setIsSupportMode(true);
          setTicketStatus("idle");
          setShowClosingCeremony(false);
        }
      } catch (err) {
        console.error("Drawer global bridge crashed:", err);
      }
    };

    window.addEventListener("open-ai-concierge", handleGlobalOpen);
    return () => window.removeEventListener("open-ai-concierge", handleGlobalOpen);
  }, [setIsOpen, setIsSupportMode, setTicketStatus, setShowClosingCeremony, setAssetSearch, setInput, setSelectedAssetObject]);

  // Load listings context
  useEffect(() => {
    const fetchContext = async () => {
      try {
        const q = query(collection(db, "listings"), limit(25));
        const snap = await getDocs(q);
        const activeItems = snap.docs.map(docSnap => {
          const data = docSnap.data();
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
        console.error("Context Loader failed:", err);
      }
    };
    fetchContext();
  }, []);

  // 📡 MULTI-TENANT LEAD BROADCAST ROUTINE
  const handleBroadcastLead = async () => {
    try {
      const activeMessagePayload = requestType === "sales" ? assetSearch : customSubject;

      if (!activeMessagePayload.trim()) {
        alert("Please provide details before attempting to broadcast.");
        return;
      }

      setTicketStatus("submitting");

      const resolvedCountry = "US";
      const shortId = Math.floor(100000 + Math.random() * 900000);
      const generatedTicketId = `tkt_gen_${shortId}`;

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

      const messageBodyString = (activeMessagePayload || "").trim();
      const structuredMatch = messageBodyString.match(/XID-[A-Z0-9]{5}/i) || messageBodyString.match(/PRD-[A-Z0-9]{5}/i);
      
      if (structuredMatch) {
        extractedProductCode = structuredMatch[0].toUpperCase();
        finalSubjectText = `Asset Inquiry: ${extractedProductCode}`;
      } else if (/^[A-Z0-9]{5}$/i.test(messageBodyString) && extractedProductCode !== "ADMIN") {
        extractedProductCode = `XID-${messageBodyString.toUpperCase()}`;
        finalSubjectText = `Asset Inquiry: ${extractedProductCode}`;
      }

      if (extractedProductCode && extractedProductCode !== "GENERAL" && extractedProductCode !== "ADMIN") {
        if (!extractedProductCode.startsWith("XID-") && extractedProductCode.length === 5) {
          extractedProductCode = `XID-${extractedProductCode.toUpperCase()}`;
        }
      }

      const buyerUserXID = user ? `USR-${user.uid}` : "USR-ANONYMOUS";

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

      const unifiedTicketDocRef = doc(db, "support_tickets", generatedTicketId);
      await setDoc(unifiedTicketDocRef, newTicketPayload);

      const firstMessageRef = collection(db, "support_tickets", generatedTicketId, "messages");
      await addDoc(firstMessageRef, {
        text: activeMessagePayload,
        sender: "client",
        isAgent: false,
        createdAt: serverTimestamp(),
        timestamp: new Date().toISOString()
      });

      localStorage.setItem("bazaria_active_ticket", generatedTicketId);
      window.dispatchEvent(new Event("new-ticket-created"));

      setTicketStatus("submitted");
    } catch (error) {
      console.error("Critical lead broadcast failure:", error);
      setTicketStatus("idle");
    }
  };

  // Filter listings
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

  // Standard Core AI Messaging Channel
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

  // 🗡️ THE MASTER RESET SABER: Decapitalizes listeners and flushes storage to absolute factory clean
  const executeMasterTeardown = () => {
    console.log("🧼 MASTER TEARDOWN TRIGGERED. Severing live backend hooks definitively.");
    
    // 1. Instantly drop and terminate Firebase listeners to break state re-entry loops
    if (ticketListenerRef.current) {
      ticketListenerRef.current();
      ticketListenerRef.current = null;
    }
    if (messagesListenerRef.current) {
      messagesListenerRef.current();
      messagesListenerRef.current = null;
    }

    // 2. Clear out persistent storage nodes safely
    localStorage.removeItem("bazaria_active_ticket");

    // 3. Force state trees completely back to factory defaults
    setShowClosingCeremony(false);
    setTicketStatus("idle");
    setIsSupportMode(false);
    setAssetSearch("");
    setCustomSubject("");
    setInput("");
    setSelectedAssetObject(null);

    // 4. Reset UI transcript map back to pristine welcome message
    setMessages([{ 
      sender: "ai", 
      text: "Greetings, I am your Bazaria AI Concierge. How may I guide you through our sovereign marketplace, active assets, or storefront setup today?" 
    }]);

    // 5. Slide drawer panel framework fully away
    setIsOpen(false);
  };

  return (
    <>
      {/* 🏷️ TRIGGER TAB */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed", right: 0, top: "45%", transform: "translateY(-50%)",
            backgroundColor: "#05292e", color: "#FFBF00", border: "1px solid #FFBF00",
            borderRight: "none", borderRadius: "12px 0 0 12px", padding: "16px 12px",
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", zIndex: 999,
            boxShadow: "-4px 4px 12px rgba(0,0,0,0.15)", transition: "all 0.2s ease"
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

      {/* 🤖 FLOATING DRAW PANEL FRAME */}
      <div
        style={{
          position: "fixed", right: isOpen ? 0 : "-400px", top: 0, width: "380px", height: "100vh",
          backgroundColor: "#ffffff", boxShadow: "-8px 0 24px rgba(5, 41, 46, 0.15)", zIndex: 1000,
          transition: "right 0.3s cubic-bezier(0.16, 1, 0.3, 1)", display: "flex", flexDirection: "column",
          fontFamily: "sans-serif", borderLeft: "4px solid #05292e"
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
          
          <button
            type="button"
            onClick={executeMasterTeardown} // 🗡️ Forces an instant listener kill and clean shutdown!
            style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "16px" }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Middle Message Stream Area Viewport Container */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "#f8fafc" }}>
          
          {showClosingCeremony ? (
            /* 🏁 THE FULL-FRAME CLOSING CEREMONY INTERACTIVE SURVEY SCREEN */
            <div style={{ 
              backgroundColor: "#ffffff", padding: "24px 16px", borderRadius: "16px", 
              border: "1px solid #ffeeba", display: "flex", flexDirection: "column", 
              alignItems: "center", gap: "16px", textAlign: "center", margin: "auto 0",
              boxShadow: "0 10px 25px rgba(5, 41, 46, 0.08)" 
            }}>
              <div style={{ fontSize: "32px" }}>🚀</div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 900, color: "#05292e" }}>Support Session Concluded</h3>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: "1.6" }}>
                Your live inquiry ticket has been successfully resolved. Please select a rating to update your local platform profile and return to marketplace operations.
              </p>
              
              {/* Sentiment Options Selection Buttons Grid */}
              <div style={{ display: "flex", gap: "10px", width: "100%", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={executeMasterTeardown}
                  style={{ flex: 1, padding: "12px 8px", borderRadius: "12px", border: "1px solid #bbf7d0", backgroundColor: "#f0fdf4", fontSize: "18px", cursor: "pointer", transition: "transform 0.1s" }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  😊 <span style={{ display: "block", fontSize: "10px", fontWeight: "bold", color: "#166534", marginTop: "4px" }}>Great</span>
                </button>

                <button
                  type="button"
                  onClick={executeMasterTeardown}
                  style={{ flex: 1, padding: "12px 8px", borderRadius: "12px", border: "1px solid #fef08a", backgroundColor: "#fefce8", fontSize: "18px", cursor: "pointer", transition: "transform 0.1s" }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  😐 <span style={{ display: "block", fontSize: "10px", fontWeight: "bold", color: "#854d0e", marginTop: "4px" }}>Okay</span>
                </button>

                <button
                  type="button"
                  onClick={executeMasterTeardown}
                  style={{ flex: 1, padding: "12px 8px", borderRadius: "12px", border: "1px solid #fecaca", backgroundColor: "#fef2f2", fontSize: "18px", cursor: "pointer", transition: "transform 0.1s" }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  🙁 <span style={{ display: "block", fontSize: "10px", fontWeight: "bold", color: "#991b1b", marginTop: "4px" }}>Poor</span>
                </button>
              </div>
            </div>
          ) : (
            /* Regular Active Text Bubble Map rendering trace loops */
            messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  backgroundColor: msg.sender === "user" ? "#05292e" : (msg.sender === "agent" ? "#e0f2fe" : "#ffffff"),
                  color: msg.sender === "user" ? "#ffffff" : "#1e293b",
                  padding: "12px 16px",
                  borderRadius: msg.sender === "user" ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.03)", fontSize: "13px", lineHeight: "1.5",
                  border: msg.sender !== "user" ? "1px solid #cbd5e1" : "none"
                }}
              >
                {msg.text}
              </div>
            ))
          )}
          
          {loading && !showClosingCeremony && (
            <div style={{ alignSelf: "flex-start", backgroundColor: "#ffffff", padding: "12px 16px", borderRadius: "16px 16px 16px 2px", border: "1px solid #e2e8f0", display: "flex", gap: "4px" }}>
              <span style={{ width: "6.5px", height: "6.5px", backgroundColor: "#05292e", borderRadius: "50%", display: "inline-block", animation: "bounce 1s infinite" }}></span>
              <span style={{ width: "6.5px", height: "6.5px", backgroundColor: "#05292e", borderRadius: "50%", display: "inline-block", animation: "bounce 1s infinite 0.2s" }}></span>
              <span style={{ width: "6.5px", height: "6.5px", backgroundColor: "#05292e", borderRadius: "50%", display: "inline-block", animation: "bounce 1s infinite 0.4s" }}></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 🤝 SPECIAL: Dynamic Support Router Interface Block Tray */}
        {isSupportMode && (
          <div style={{ padding: "16px 20px", backgroundColor: "#fff8e6", borderTop: "1px solid #ffeeba", display: "flex", flexDirection: "column", gap: "12px" }}>
            
            {/* ─── STAGE 1 & 2: INITIAL SETUP & ROUTING FORM ─── */}
            {ticketStatus !== "submitted" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: "bold", color: "#856404" }}>
                    Live Assistance Router
                  </span>
                  <button 
                    type="button"
                    onClick={executeMasterTeardown}
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
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => setRequestType("sales")}
                        style={{
                          flex: 1, padding: "6px", borderRadius: "6px", fontSize: "10px", fontWeight: "bold", cursor: "pointer",
                          border: requestType === "sales" ? "2px solid #05292e" : "1px solid #cbd5e1",
                          backgroundColor: requestType === "sales" ? "#05292e" : "#ffffff", color: requestType === "sales" ? "#FFBF00" : "#475569"
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
                          backgroundColor: requestType === "admin" ? "#05292e" : "#ffffff", color: requestType === "admin" ? "#FFBF00" : "#475569"
                        }}
                      >
                        ⚙️ Tech & Admin
                      </button>
                    </div>

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
                            const structuredToken = rawValue.toUpperCase().includes("XID-") ? rawValue.toUpperCase().trim() : `XID-${rawValue.toUpperCase().trim()}`;
                            setSelectedAssetObject({ id: rawValue.toUpperCase(), title: rawValue, product_code: structuredToken, xid: structuredToken });
                            setShowSuggestions(true);
                          }}
                          onFocus={() => setShowSuggestions(true)}
                          required
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "11px", boxSizing: "border-box" }}
                        />
                        
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
                        width: "100%", padding: "10px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold",
                        backgroundColor: ticketStatus === "submitting" ? "#cbd5e1" : "#05292e", color: ticketStatus === "submitting" ? "#475569" : "#FFBF00",
                        border: "1px solid #FFBF00", cursor: ticketStatus === "submitting" ? "not-allowed" : "pointer",
                      }}
                    >
                      Confirm & Broadcast Lead 📡
                    </button>
                  </form>
                )}

                {ticketStatus === "submitting" && (
                  <div style={{ fontSize: "11px", color: "#856404", fontStyle: "italic", textAlign: "center", padding: "12px" }}>
                    Broadcasting matrix signal to agent array... 📡
                  </div>
                )}
              </div>
            )}

            {/* ─── STAGE 3: FOOTER CHAT CONNECTOR CONTROLS ─── */}
            {ticketStatus === "submitted" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                
                {showClosingCeremony ? (
                  /* Lock out input channel completely when ceremony takes over main stream container */
                  <div style={{ 
                    textAlign: "center", padding: "10px", fontSize: "11px", fontWeight: "bold", 
                    color: "#64748b", backgroundColor: "#f1f5f9", borderRadius: "8px", border: "1px solid #e2e8f0"
                  }}>
                    🔒 INQUIRY CONCLUDED — SELECT A RATING ABOVE
                  </div>
                ) : (
                  /* Standard active interactive chat input string form */
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
                        console.error("Outbound client message dropped:", err);
                      }
                    }}
                    style={{ display: "flex", gap: "8px", alignItems: "center", width: "100%" }}
                  >
                    <input
                      name="clientMessage"
                      type="text"
                      placeholder={requestType === "admin" ? "Type a message to admin staff..." : "Type a message to the agent..."}
                      required
                      style={{ flex: 1, padding: "10px 14px", borderRadius: "20px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                    />
                    <button
                      type="submit"
                      style={{
                        backgroundColor: "#05292e", color: "#FFBF00", border: "none",
                        width: "36px", height: "36px", borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", fontSize: "14px", flexShrink: 0
                      }}
                    >
                      <FaPaperPlane size={12} />
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* 🛡️ GUARD LAYER: Base AI interfaces when human agent routing tracks are offline */}
        {!isSupportMode && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 20px", backgroundColor: "#ffffff", display: "flex", gap: "8px", overflowX: "auto", borderTop: "1px solid #f1f5f9" }}>
              <button 
                type="button"
                onClick={() => suggestPrompt("Are there any premium assets available?")}
                style={{ padding: "6px 12px", backgroundColor: "#f1f5f9", border: "none", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", color: "#475569", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                🔍 Browse Assets
              </button>
              <button 
                type="button"
                onClick={() => suggestPrompt("How do I establish a storefront?")}
                style={{ padding: "6px 12px", backgroundColor: "#f1f5f9", border: "none", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", color: "#475569", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                🏪 Create Storefront
              </button>
            </div>

            <div style={{ padding: "16px 20px", borderTop: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
              <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask the AI Concierge a question..."
                  style={{ flex: 1, padding: "10px 14px", borderRadius: "20px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
                <button type="submit" style={{ backgroundColor: "#05292e", color: "#FFBF00", border: "none", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <FaPaperPlane size={12} />
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
