"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperPlane, FaMagic } from "react-icons/fa";
import { db, auth } from "@/lib/firebase/client";
// 🎯 UPDATED: Added addDoc and serverTimestamp for streaming broadcast writes
import { collection, getDocs, limit, query, addDoc, serverTimestamp } from "firebase/firestore";
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

  // 🧬 Set Dynamic Cognitive Greeting based on the Active Workspace
  useEffect(() => {
    const isRewardsPath = typeof window !== "undefined" && window.location.pathname.includes("/rewards");
    
    const initialText = isRewardsPath
      ? `Greetings, Success Partner. I am your Operations Concierge. Your active agent workbench is synced. How can I assist you with analyzing your yield projections, tracing an X-ID lineage, or managing active pool leads today?`
      : `Greetings, I am your Bazaria AI Concierge. How may I guide you through our sovereign marketplace, active assets, or storefront setup today?`;

    setMessages([{ sender: "ai", text: initialText }]);
  }, []);
  
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

// 📡 MULTI-TENANT LEAD BROADCAST ROUTINE
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

      // 🔍 2. DYNAMICALLY EXTRACT 5-DIGIT PRODUCT XID FOR SALES ENTRIES
      let extractedProductCode = "";
      if (requestType === "sales" && selectedAssetObject) {
        // Uses your existing getProductCode utility to pull down the clean 5-digit code signature
        extractedProductCode = getProductCode(selectedAssetObject.id) || "GENERAL";
      } else {
        extractedProductCode = "ADMIN";
      }

      // Assemble payload matching your schema verified in your Firestore console
      const newTicketPayload = {
        ticketId: generatedTicketId,
        agentUid: user?.uid || "AI_CONCIERGE_GATEWAY",
        agentName: user?.displayName || user?.email || "Anonymous User",
        countryCode: resolvedCountry,      // 🛡️ The Master Geofence Filter Tag
        type: requestType,                  // Natively matches "sales" or "admin" state
        status: "open",
        
        // 🎯 NEW INTEGRATED BINDINGS:
        product_code: extractedProductCode, // Ties directly to agent console's detector!
        subject: requestType === "sales" && selectedAssetObject ? selectedAssetObject.title : "Technical Assistance",
        
        lastMessage: activeMessagePayload, // 🎯 Captures the exact input string that was typed
        updatedAt: serverTimestamp()
      };

      console.log("Broadcasting ticket payload to cloud storage with XID context:", newTicketPayload);

      // 🚀 3. Inject directly into your centralized Firestore pipeline collection
      await addDoc(collection(db, "support_tickets"), newTicketPayload);
      
      // Reset input layout states cleanly on a successful transaction write
      setTicketStatus("submitted");
      setAssetSearch("");
      setCustomSubject("");
      setSelectedAssetObject(null); // Clean up the reference state object
      
      alert(`Lead securely broadcasted to matching regional managers!`);

    } catch (error) {
      console.error("Critical failure during lead broadcast delivery:", error);
      setTicketStatus("idle");
    }
  };
  
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
      const customEvent = event as CustomEvent;
      setIsOpen(true);
      
      if (customEvent.detail?.mode === "support") {
        setIsSupportMode(true);
        setMessages(prev => {
          if (prev.some(m => m.text.includes("support array"))) return prev;
          return [
            ...prev,
            {
              sender: "ai",
              text: "System Alert: I have routed your query to our support array. If your task requires human oversight, you can request a Live Listing Agent at any time using the console panel below."
            }
          ];
        });
      }
    };

    window.addEventListener("open-ai-concierge", handleGlobalOpen);
    return () => window.removeEventListener("open-ai-concierge", handleGlobalOpen);
  }, []);

  // Load active listings to feed into autocomplete and AI
  useEffect(() => {
    const fetchContext = async () => {
      try {
        const q = query(collection(db, "listings"), limit(25));
        const snap = await getDocs(q);
        const activeItems = snap.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title,
            price: data.price,
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

  // Filter listings based on what the user types in real-time
  const filteredAssets = marketplaceContext.filter(asset =>
    asset.title.toLowerCase().includes(assetSearch.toLowerCase()) ||
    (asset.category && asset.category.toLowerCase().includes(assetSearch.toLowerCase()))
  );

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

  // 🤝 Hand off to a Live Agent (Dual-Routing with strict X-ID Ancestry Mapping)
  const handleRequestLiveAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessages(prev => [...prev, { 
        sender: "ai", 
        text: "Please sign in to your Bazaria account to request a Live Agent." 
      }]);
      return;
    }

    setTicketStatus("submitting");

    try {
      // Extract unique parent/citizen variables
      const parentListingXID = requestType === "sales" && selectedAssetObject 
        ? selectedAssetObject.id // Will be its existing PRD-xxxxx X-ID
        : null;

      const buyerUserXID = `USR-${user.uid}`; // Buyer X-ID (Cross-Link)

      // Compile the unalterable Event Object Lineage (Part 3 Compliance)
      const lineageBlock = createLineageBlock({
        type: "INQ",
        parent: parentListingXID,
        cross_links: [buyerUserXID]
      });

      const shortProductCode = parentListingXID ? getProductCode(parentListingXID) : "GENERAL";

      let finalSubject = "";
      if (requestType === "sales" && selectedAssetObject) {
        finalSubject = `${selectedAssetObject.title} [Ref: #${shortProductCode}]`;
      } else {
        finalSubject = customSubject ? `Admin: ${customSubject}` : "Admin: Technical Assistance";
      }

      const actualUserQuestion = messages.filter(m => m.sender === "user").pop()?.text || 
                                "Citizen requested live assistance.";

      // 🚀 Write to the database with Lineage Integrity
      await addDoc(collection(db, "inquiries"), {
        // 🧬 Strict X-ID Block
        xid_chain: lineageBlock,
        
        // Metadata fields for public presentation
        product_code: shortProductCode,
        subject: finalSubject,
        message: actualUserQuestion,
        customer_id: user.uid,
        customer_name: user.displayName || "Citizen",
        customer_email: user.email || "anonymous@bazaria.world",
        
        // Operational Routing Keys
        request_type: requestType,
        status: requestType === "sales" ? "pending_agent" : "pending_admin", 
        
        // Context Transcript
        transcript: messages.map(m => `${m.sender.toUpperCase()}: ${m.text}`),
        created_at: new Date().toISOString(),
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });

      setTicketStatus("submitted");
      
      const successMsg = requestType === "sales" 
        ? `✅ Your inquiry has been logged under ID #${shortProductCode}. An active Listing Agent has been paged to claim your channel.`
        : "✅ Your support ticket has been sent to our Administrative team for technical review.";

      setMessages(prev => [...prev, { sender: "ai", text: successMsg }]);
    } catch (err) {
      console.error("Handoff submission error:", err);
      setTicketStatus("idle");
      setMessages(prev => [...prev, { 
        sender: "ai", 
        text: "Transmission array error: Failed to dispatch ticket. Please try again shortly." 
      }]);
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: "#856404" }}>
                Live Assistance Router
              </span>
              <button 
                onClick={() => {
                  setIsSupportMode(false);
                  setTicketStatus("idle");
                  setAssetSearch("");
                  setSelectedAssetObject(null);
                }}
                style={{ background: "none", border: "none", fontSize: "10px", color: "#856404", cursor: "pointer", textDecoration: "underline" }}
              >
                Return to AI Menu
              </button>
            </div>
            
           {ticketStatus === "idle" && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();   // 🛡️ Lock out default browser reload signals
                  handleBroadcastLead(); // 🚀 Execute our multi-tenant routing engine
                }} 
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                {/* Router Selector Buttons */}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setRequestType("sales")}
                    style={{
                      flex: 1,
                      padding: "6px",
                      borderRadius: "6px",
                      fontSize: "10px",
                      fontWeight: "bold",
                      cursor: "pointer",
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
                      flex: 1,
                      padding: "6px",
                      borderRadius: "6px",
                      fontSize: "10px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      border: requestType === "admin" ? "2px solid #05292e" : "1px solid #cbd5e1",
                      backgroundColor: requestType === "admin" ? "#05292e" : "#ffffff",
                      color: requestType === "admin" ? "#FFBF00" : "#475569"
                    }}
                  >
                    ⚙️ Tech & Admin
                  </button>
                </div>

                {/* Conditional Inputs */}
                {requestType === "sales" ? (
                  <div ref={suggestionRef} style={{ position: "relative" }}>
                    <label style={{ fontSize: "9px", fontWeight: "bold", color: "#856404", display: "block", marginBottom: "4px" }}>
                      Which listing are you inquiring about?
                    </label>
                    <input
                      type="text"
                      placeholder="Type to search... (e.g., Punta Cana, Camry)"
                      value={assetSearch}
                      onChange={(e) => {
                        setAssetSearch(e.target.value);
                        setSelectedAssetObject({ id: generateXid("PRD"), title: e.target.value }); // Fallback object if they type custom
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      required
                      style={{ 
                        width: "100%", 
                        padding: "8px", 
                        borderRadius: "6px", 
                        border: "1px solid #cbd5e1", 
                        fontSize: "11px", 
                        boxSizing: "border-box" 
                      }}
                    />
                    
                    {/* Floating Autocomplete Suggestions Dropdown (Opens Upward) */}
                    {showSuggestions && assetSearch.trim().length > 0 && filteredAssets.length > 0 && (
                      <ul style={{
                        position: "absolute",
                        bottom: "100%", 
                        left: 0,
                        width: "100%",
                        backgroundColor: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        maxHeight: "130px",
                        overflowY: "auto",
                        margin: "0 0 4px 0",
                        padding: 0,
                        listStyle: "none",
                        zIndex: 1010,
                        boxShadow: "0 -4px 12px rgba(0,0,0,0.1)"
                      }}>
                        {filteredAssets.map((asset, idx) => {
                          const shortCode = getProductCode(asset.id);
                          return (
                            <li
                              key={idx}
                              onClick={() => {
                                setAssetSearch(`${asset.title} (#${shortCode})`);
                                setSelectedAssetObject(asset);
                                setShowSuggestions(false);
                              }}
                              style={{ 
                                padding: "8px 12px", 
                                fontSize: "11px", 
                                cursor: "pointer", 
                                borderBottom: "1px solid #f1f5f9",
                                color: "#1e293b",
                                textAlign: "left"
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                  <b style={{ color: "#05292e" }}>{asset.title}</b> 
                                  {asset.price && (
                                    <span style={{ fontSize: "10px", color: "#0d9488", marginLeft: "6px", fontWeight: "bold" }}>
                                      ${asset.price.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                <span style={{ 
                                  fontSize: "9px", 
                                  backgroundColor: "#f1f5f9", 
                                  color: "#475569", 
                                  padding: "2px 6px", 
                                  borderRadius: "4px", 
                                  fontFamily: "monospace",
                                  fontWeight: "bold"
                                }}>
                                  #{shortCode}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div>
                    <label style={{ fontSize: "9px", fontWeight: "bold", color: "#856404", display: "block", marginBottom: "4px" }}>
                      What technical issue are you facing?
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Wallet Connect Error, Profile Update Bug"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      required
                      style={{ 
                        width: "100%", 
                        padding: "8px", 
                        borderRadius: "6px", 
                        border: "1px solid #cbd5e1", 
                        fontSize: "11px", 
                        boxSizing: "border-box" 
                      }}
                    />
                  </div>
                )}

                <button
  type="submit"
  disabled={ticketStatus === "submitting"}
  style={{
    width: "100%",
    padding: "10px",
    backgroundColor: ticketStatus === "submitting" ? "#cbd5e1" : "#05292e", // Visual feedback on write
    color: ticketStatus === "submitting" ? "#475569" : "#FFBF00",
    border: "1px solid #FFBF00",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "bold",
    cursor: ticketStatus === "submitting" ? "not-allowed" : "pointer",
    transition: "opacity 0.2s"
  }}
  onMouseOver={(e) => { if(ticketStatus !== "submitting") e.currentTarget.style.opacity = "0.9"; }}
  onMouseOut={(e) => { e.currentTarget.style.opacity = "1"; }}
>
  {ticketStatus === "submitting" ? "Broadcasting Matrix Signal... 📡" : "Confirm & Broadcast Lead 📡"}
</button>
              </form>
            )}

            {ticketStatus === "submitting" && (
              <div style={{ fontSize: "11px", color: "#856404", fontStyle: "italic", textAlign: "center", padding: "6px" }}>
                Broadcasting payload to target dashboard...
              </div>
            )}

            {ticketStatus === "submitted" && (
              <div style={{ fontSize: "11px", fontWeight: "bold", color: "#155724", backgroundColor: "#d4edda", padding: "8px", borderRadius: "6px", textAlign: "center" }}>
                📡 Broadcast Successful!
              </div>
            )}
          </div>
        )}

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

        {/* Message Input Box */}
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
      </div>
    </>
  );
}
