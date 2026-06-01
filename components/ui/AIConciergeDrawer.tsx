"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperPlane, FaMagic } from "react-icons/fa";
import { db, auth } from "@/lib/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { usePathname } from "next/navigation";

// 🎯 CONSOLIDATED FIRESTORE MATRIX (No duplicates)
import { collection, doc, onSnapshot, query, orderBy, limit, getDocs, addDoc, setDoc, serverTimestamp } from "firebase/firestore";

interface AIConciergeDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialMode?: "ai" | "support";
}

export default function AIConciergeDrawer({
  isOpen: propIsOpen,
  setIsOpen: propSetIsOpen,
  initialMode = "ai"
}: AIConciergeDrawerProps) {

  const pathname = usePathname();
  const ticketListenerRef = useRef<boolean>(false);
  const messagesListenerRef = useRef<any>(null);

  const suggestionRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Sync incoming parent open state signals safely without breaking component scope
  useEffect(() => {
    if (propIsOpen !== undefined) {
      setIsOpen(propIsOpen);
    }
  }, [propIsOpen]);

  // Sync outgoing state changes back up to the parent prop handler safely if it exists
  const handleToggleOpen = (nextState: boolean) => {
    setIsOpen(nextState);
    if (typeof propSetIsOpen === "function") {
      propSetIsOpen(nextState);
    }
  };

  // 💬 Core Stream Arrays & Identity Nodes
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [marketplaceContext, setMarketplaceContext] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // 🎟️ Support & Routing States
  const [isSupportMode, setIsSupportMode] = useState<boolean>(initialMode === "support");
  const [ticketStatus, setTicketStatus] = useState<"idle" | "submitting" | "submitted">("idle");
  const [showClosingCeremony, setShowClosingCeremony] = useState<boolean>(false);
  const [requestType, setRequestType] = useState<"sales" | "admin">("sales");

  // 🔎 Context Search Fields
  const [assetSearch, setAssetSearch] = useState<string>("");
  const [customSubject, setCustomSubject] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedAssetObject, setSelectedAssetObject] = useState<any | null>(null);

  const [input, setInput] = useState<string>("");

  /* 🏁 MODULE 1: PATH PROTOCOL UPGRADE */
  useEffect(() => {
    const isExplicitSupportRoute = pathname?.includes("/support");
    const hasCrossRouteSupportFlag = typeof window !== "undefined" && sessionStorage.getItem("force_open_support_triage") === "true";

    if (isExplicitSupportRoute || hasCrossRouteSupportFlag) {
      console.log(" 🎟️ Support path context verified. Lock-syncing drawer properties open securely.");
      setIsOpen((prev) => !prev ? true : prev);
      setIsSupportMode((prev) => !prev ? true : prev);

      if (hasCrossRouteSupportFlag && typeof window !== "undefined") {
        sessionStorage.removeItem("force_open_support_triage");
      }
    }
  }, [pathname, setIsOpen]);

  /* 📡 MODULE 2: FIRESTORE REAL-TIME SNAPSHOT CORE */
  useEffect(() => {
    const activeTicketId = typeof window !== "undefined" ? localStorage.getItem("bazaria_active_ticket") : null;
    
    if (!activeTicketId || activeTicketId === "undefined" || activeTicketId === "null" || !activeTicketId.trim()) {
      // If we are already in submitted mode, don't let a missing local token kill a live viewport session
      if (ticketStatus === "submitted") return;
      return;
    }
    console.log(" ♻️ Connecting unified real-time message stream to session:", activeTicketId);
    ticketListenerRef.current = true;
    
    const ticketDocRef = doc(db, "support_tickets", activeTicketId);
    const messagesSubcollectionRef = collection(db, "support_tickets", activeTicketId, "messages");
    const messagesQuery = query(messagesSubcollectionRef);

    const unsubscribeTicket = onSnapshot(ticketDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const ticketData = snapshot.data();
        console.log(" 🔍 REAL-TIME UNIFIED STATUS CHECK:", ticketData.status);

        const normalizedStatus = String(ticketData.status || "").toLowerCase().trim();
        if (normalizedStatus === "closed" || normalizedStatus === "resolved") {
          console.log(" 🏁 MATCH: Final resolution state. Displaying evaluation survey.");
          setTicketStatus((prev) => prev !== "submitted" ? "submitted" : prev);
          setIsSupportMode((prev) => !prev ? true : prev);
          setShowClosingCeremony((prev) => !prev ? true : prev);
        }
        else if (normalizedStatus === "claimed" || normalizedStatus === "assigned" || normalizedStatus === "open") {
          console.log(" 🤝 MATCH: Ticket is wide awake. Locking notification anchors secure.");
          
          setTicketStatus((prev) => {
            if (prev !== "submitted") return "submitted";
            return prev;
          });
          setIsSupportMode((prev) => {
            if (!prev) return true;
            return prev;
          });
          setShowClosingCeremony((prev) => {
            if (prev) return false;
            return prev;
          });
        }
        else {
          console.log(" ⚠️ FALLBACK: Alternative status state encountered. Keeping layout anchored.");
          setTicketStatus((prev) => {
            if (prev !== "submitted") return "submitted";
            return prev;
          });
          setIsSupportMode((prev) => {
            if (!prev) return true;
            return prev;
          });
          setShowClosingCeremony((prev) => {
            if (prev) return false;
            return prev;
          });
        }
      }
    }, (error) => {
      console.error(" ❌ Realtime status snapshot error:", error);
    });

    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const liveMsgs = snapshot.docs.map(docSnap => {
        const data = docSnap.data();

        let resolvedSender: "user" | "ai" | "agent" | "client" = "user";
        if (data.isAgent === true || data.sender === "agent" || data.sender === "admin") {
          resolvedSender = "agent";
        } else if (data.sender === "ai" || data.sender === "system") {
          resolvedSender = "ai";
        } else if (data.sender === "client" || data.senderName === "Client") {
          resolvedSender = "client";
        } else {
          resolvedSender = "user";
        }

        let numericTime = 0;
        const rawDate = data.created_at || data.createdAt || data.timestamp;
        if (rawDate) {
          if (rawDate.seconds) {
            numericTime = rawDate.seconds * 1000;
          } else if (typeof rawDate === "string" || typeof rawDate === "number") {
            numericTime = Date.parse(rawDate) || Number(rawDate);
          }
        }
        if (!numericTime || isNaN(numericTime)) {
          const digits = data.text?.match(/\d+/);
          numericTime = digits ? parseInt(digits[0], 10) : Date.now();
        }
        return {
          id: docSnap.id,
          text: data.text || "",
          sender: resolvedSender,
          senderName: data.senderName || (resolvedSender === "client" || resolvedSender === "user" ? "You" : "Staff"),
          senderPhoto: data.senderPhoto || null,
          sortKey: numericTime,
          timestamp: new Date(numericTime).toISOString()
        };
      })
      .filter(msg => msg.text && !msg.text.includes("Lead successfully claimed and synced to your node grid!"));

      const chronologicalItems = liveMsgs.sort((a, b) => a.sortKey - b.sortKey);
      console.log(" 📥 Chronological message batch synced. Total records:", chronologicalItems.length);

      const systemNoticeText = ` ✨ A Certified Success Partner has successfully claimed your broadcast ticket window. Standby for direct operational support...`;
      const hasNoticeAlready = chronologicalItems.some(m => m.text === systemNoticeText);

      if (!hasNoticeAlready && chronologicalItems.length > 0) {
        setMessages([
          { sender: "ai", text: chronologicalItems[0].text, sortKey: 0 },
          { sender: "ai", text: systemNoticeText, sortKey: 1 },
          ...chronologicalItems.slice(1)
        ]);
      } else {
        setMessages(chronologicalItems);
      }
    }, (error) => {
      console.error(" ❌ Realtime message stream snapshot error:", error);
    });

    if (messagesListenerRef) {
      messagesListenerRef.current = unsubscribeMessages;
    }
    return () => {
      unsubscribeTicket();
      unsubscribeMessages();
      ticketListenerRef.current = false;
      if (messagesListenerRef) {
        messagesListenerRef.current = null;
      }
    };
  }, [setTicketStatus, setIsSupportMode, setShowClosingCeremony, setMessages, ticketStatus, isSupportMode, showClosingCeremony]);

  /* 🔐 USER AUTHENTICATION STATE TRACKING LINK */
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  // Auto-scroll track handler
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Dropdown helper click handlers
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

        if (typeof setIsOpen === "function") {
          setIsOpen(true);
        } else {
          console.warn(" ⚠️ AIConciergeDrawer: setIsOpen prop missing from parent context.");
        }

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
        const isSupport = customEvent.detail?.mode === "support" || pathname?.includes("/support");
        if (isSupport) {
          setIsSupportMode(true);
          const activeTicketId = localStorage.getItem("bazaria_active_ticket");
          if (!activeTicketId || activeTicketId === "undefined" || activeTicketId === "null") {
            setTicketStatus("idle");
            setShowClosingCeremony(false);
          }
        }
      } catch (err) {
        console.error("Drawer global bridge crashed:", err);
      }
    };
    window.addEventListener("open-ai-concierge", handleGlobalOpen);
    return () => window.removeEventListener("open-ai-concierge", handleGlobalOpen);
  }, [setIsOpen, setIsSupportMode, setTicketStatus, setShowClosingCeremony, setAssetSearch, setInput, setSelectedAssetObject, pathname]);

  // Load listings context configuration layers
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

  // MULTI-TENANT LEAD BROADCAST ROUTINE
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

  // Autocomplete context filtering maps
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

  // 📡 Core AI & Human Support Messaging Execution Channels
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput(""); 
    const activeTicketId = typeof window !== "undefined" ? localStorage.getItem("bazaria_active_ticket") : null;
    const isLiveSupport = isSupportMode && activeTicketId && activeTicketId !== "undefined" && activeTicketId !== "null";
    
    if (isLiveSupport) {
      try {
        const messagesSubcollectionRef = collection(db, "support_tickets", activeTicketId, "messages");

        await addDoc(messagesSubcollectionRef, {
          text: userMessage,
          sender: "client",
          senderName: "You",
          senderPhoto: user?.photoURL || null,
          isAgent: false,
          timestamp: new Date().toISOString(),
          createdAt: new Date()
        });
        
        const isHumanAgentActive = ticketStatus === "claimed" || ticketStatus === "assigned";
        if (!isHumanAgentActive) {
          console.log(" 🤖 Forwarding message turn to AI Concierge engine...");
          setLoading(true);

          const resolvedXid = activeTicketId || localStorage.getItem("bazaria_current_xid") || "XID_FALLBACK";
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: userMessage,
              ticketId: activeTicketId,
              xid: resolvedXid
            })
          });
          
          if (!response.ok) {
            setLoading(false);
            throw new Error(`AI response channel rejected data turn: Status ${response.status}`);
          }

          const data = await response.json();
          setLoading(false);

          await addDoc(messagesSubcollectionRef, {
            text: data.text || data.message || "My communication matrix dropped this packet context. Please re-verify entry.",
            sender: "ai",
            senderName: "AI Concierge",
            isAgent: false,
            timestamp: new Date().toISOString(),
            createdAt: new Date()
          });

          setLoading(false);
        }
      } catch (error) {
        console.error(" ❌ Failed to process message stream turn:", error);
        setLoading(false);
      }
      return;
    }
    
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
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

 // 🗡️ THE MASTER RESET SABER (With absolute protection guards)
  const executeMasterTeardown = (force = false) => {
    // 🛡️ THE RUNTIME SHIELD: Block spontaneous cleanup triggers while a ticket is actively open on the user side
    const activeSessionToken = typeof window !== "undefined" ? localStorage.getItem("bazaria_active_ticket") : null;
    
    if (activeSessionToken && !force) {
      console.log("🛡️ PROTECTOR TRIGGERED: Suppressed an accidental teardown sequence to preserve live notification sync channels.");
      return;
    }

    console.log(" 🧼 MASTER TEARDOWN COMMENCED. Decapitating connection arrays cleanly.");

    ticketListenerRef.current = false;
    if (messagesListenerRef.current && typeof messagesListenerRef.current === "function") {
      try {
        messagesListenerRef.current();
      } catch (err) {
        console.warn(" ⚠️ Issue while unhooking real-time message stream listener:", err);
      }
      messagesListenerRef.current = null;
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("bazaria_active_ticket");
      sessionStorage.removeItem("force_open_support_triage");
    }
    setShowClosingCeremony(false);
    setTicketStatus("idle");
    setIsSupportMode(false);
    setAssetSearch("");
    setCustomSubject("");
    setInput("");
    setSelectedAssetObject(null);
    setMessages([{
      sender: "ai",
      text: "Greetings, I am your Bazaria AI Concierge. How may I guide you through our sovereign marketplace, active assets, or storefront setup today?"
    }]);
    setIsOpen(false);
  };

  return (
    <>
      {/* 🏷️ TRIGGER TAB */}
      {!isOpen && (
        <button
          onClick={() => handleToggleOpen(true)}
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
            onClick={() => {
              localStorage.removeItem("bazaria_active_ticket");
              if (typeof setTicketStatus === "function") {
                setTicketStatus("idle");
              }
              executeMasterTeardown();
            }}
            style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "16px" }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Scrollable Center Chat Window Container */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "#f8fafc" }}>

          {showClosingCeremony ? (
            /* 🏁 FULL-WINDOW INTERACTIVE SURVEY BLOCK INTERFACES */
            <div style={{
              backgroundColor: "#ffffff", padding: "24px 16px", borderRadius: "16px",
              border: "1px solid #ffeeba", display: "flex", flexDirection: "column",
              alignItems: "center", gap: "16px", textAlign: "center", margin: "auto 0",
              boxShadow: "0 10px 25px rgba(5, 41, 46, 0.08)"
            }}>
              <div style={{ fontSize: "32px" }}> 🚀 </div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 900, color: "#05292e" }}>Support Session Concluded</h3>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: "1.6" }}>
                Your live ticket context has been successfully resolved. Please submit a service rating option below to clean out historical sessions and unlock your standard AI Concierge interface.
              </p>

              <div style={{ display: "flex", gap: "10px", width: "100%", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={async () => {
                    const activeId = localStorage.getItem("bazaria_active_ticket");
                    if (activeId) {
                      try {
                        const { doc, updateDoc } = await import("firebase/firestore");
                        await updateDoc(doc(db, "support_tickets", activeId), { rating: 5, score: 5, stars: 5, status: "closed" });
                      } catch (err) { console.error("Rating drop failed:", err); }
                    }
                    executeMasterTeardown();
                  }}
                  style={{ flex: 1, padding: "12px 8px", borderRadius: "12px", border: "1px solid #bbf7d0", backgroundColor: "#f0fdf4", fontSize: "18px", cursor: "pointer", transition: "transform 0.1s" }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  😊  <span style={{ display: "block", fontSize: "10px", fontWeight: "bold", color: "#166534", marginTop: "4px" }}>Great</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const activeId = localStorage.getItem("bazaria_active_ticket");
                    if (activeId) {
                      try {
                        const { doc, updateDoc } = await import("firebase/firestore");
                        await updateDoc(doc(db, "support_tickets", activeId), { rating: 3, score: 3, stars: 3, status: "closed" });
                      } catch (err) { console.error("Rating drop failed:", err); }
                    }
                    executeMasterTeardown();
                  }}
                  style={{ flex: 1, padding: "12px 8px", borderRadius: "12px", border: "1px solid #fef08a", backgroundColor: "#fefce8", fontSize: "18px", cursor: "pointer", transition: "transform 0.1s" }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  😐  <span style={{ display: "block", fontSize: "10px", fontWeight: "bold", color: "#854d0e", marginTop: "4px" }}>Okay</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const activeId = localStorage.getItem("bazaria_active_ticket");
                    if (activeId) {
                      try {
                        const { doc, updateDoc } = await import("firebase/firestore");
                        await updateDoc(doc(db, "support_tickets", activeId), { rating: 1, score: 1, stars: 1, status: "closed" });
                      } catch (err) { console.error("Rating drop failed:", err); }
                    }
                    executeMasterTeardown();
                  }}
                  style={{ flex: 1, padding: "12px 8px", borderRadius: "12px", border: "1px solid #fecaca", backgroundColor: "#fef2f2", fontSize: "18px", cursor: "pointer", transition: "transform 0.1s" }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  🙁  <span style={{ display: "block", fontSize: "10px", fontWeight: "bold", color: "#991b1b", marginTop: "4px" }}>Poor</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: '12px',
              boxSizing: 'border-box',
              padding: '16px'
            }}>

              {/* 🎯 BASELINE GREETING DISPLAY */}
              {(!messages || messages.filter(m => m.text && !m.text.startsWith("XID-")).length <= 0) && (
                <div style={{ display: "flex", width: "100%", justifyContent: "flex-start", marginBottom: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", maxWidth: "85%", gap: "10px" }}>
                    <img
                      src="https://api.dicebear.com/7.x/bottts/svg?seed=BazariaAI&backgroundColor=011619"
                      alt="Avatar"
                      style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '9px', color: '#64748b', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '4px' }}>AI Concierge</span>
                      <div style={{ backgroundColor: '#1e293b', color: '#ffffff', padding: '10px 14px', borderRadius: '16px 16px 16px 2px', border: '1px solid #334155', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', textAlign: 'left' }}>
                        <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.4' }}>
                          Greetings, I am your Bazaria AI Concierge. How may I guide you through our sovereign marketplace, active assets, or storefront setup today?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 🔄 MESSAGES STREAM LOOP CONTAINER */}
              {messages && messages
                .filter(msg => msg.text && !msg.text.startsWith("XID-") && !msg.text.includes("How may I guide you through our sovereign marketplace"))
                .map((msg, index) => {
                  const isClientUser =
                    msg.sender === "client" ||
                    msg.sender === "user" ||
                    msg.isAgent === false ||
                    String(msg.senderName).toLowerCase() === "you";

                  const isSystemAI = msg.sender === "ai" || msg.sender === "system";
                  const defaultAgentAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80";
                  const artificialIntelligenceAvatar = "https://api.dicebear.com/7.x/bottts/svg?seed=BazariaAI&backgroundColor=011619";

                  const resolvedAvatar = isSystemAI ? artificialIntelligenceAvatar : (msg.senderPhoto || defaultAgentAvatar);
                  return (
                    <div
                      key={msg.id || index}
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: isClientUser ? "flex-end" : "flex-start",
                        boxSizing: "border-box",
                        marginBottom: "12px"
                      }}
                    >
                      <div style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-end",
                        maxWidth: "85%",
                        gap: "10px"
                      }}>

                        {!isClientUser && (
                          <img
                            src={resolvedAvatar}
                            alt="Avatar"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              flexShrink: 0
                            }}
                          />
                        )}
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isClientUser ? 'flex-end' : 'flex-start'
                        }}>

                          <span style={{
                            fontSize: '9px',
                            color: '#64748b',
                            fontFamily: 'monospace',
                            textTransform: 'uppercase',
                            marginBottom: '4px',
                            paddingLeft: '4px',
                            paddingRight: '4px'
                          }}>
                            {isClientUser ? "You" : (isSystemAI ? "AI Concierge" : (msg.senderName || "Agent"))}
                          </span>

                          <div style={{
                            backgroundColor: isClientUser ? '#e2e8f0' : '#1e293b',
                            color: isClientUser ? '#0f172a' : '#ffffff',
                            padding: '10px 14px',
                            borderRadius: isClientUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                            border: isClientUser ? '1px solid #cbd5e1' : '1px solid #334155',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap',
                            textAlign: 'left'
                          }}>
                            <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.4', fontWeight: isClientUser ? 600 : 400 }}>
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* ⏳ RELIABLE TYPING INDICATOR LOOP */}
              {loading && (
                <div style={{ display: "flex", width: "100%", justifyContent: "flex-start", marginBottom: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", maxWidth: "85%", gap: "10px" }}>
                    <img src="https://api.dicebear.com/7.x/bottts/svg?seed=BazariaAI&backgroundColor=011619" alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '9px', color: '#64748b', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '4px' }}>AI Concierge</span>
                      <div style={{ backgroundColor: '#1e293b', color: '#ffffff', padding: '10px 14px', borderRadius: '16px 16px 16px 2px', border: '1px solid #334155', animation: 'pulse 1.5s infinite' }}>
                        <span style={{ letterSpacing: "2px", fontWeight: "bold" }}>● ● ●</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Anchor for auto-scroll tracking context */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 🤝 SPECIAL: Dynamic Support Router Form Tray Footers */}
        {isSupportMode && (
          <div style={{ padding: "16px 20px", backgroundColor: "#031a1e", borderTop: "1px solid #1e293b", display: "flex", flexDirection: "column", gap: "12px", flexShrink: 0 }}>

            {/* ─── STAGE 1 & 2: INITIAL SETUP & ROUTING SELECTION DEPARTMENT FORM ─── */}
            {ticketStatus !== "submitted" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: "bold", color: "#2dd4bf" }}>
                    Live Assistance Router
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      // ⚡ MANUAL OVERRIDE FLAG: Only clear the ticket state if explicitly clicked by a human user
                      executeMasterTeardown(true);
                    }}
                    style={{ background: "none", border: "none", fontSize: "10px", color: "#64748b", cursor: "pointer", textDecoration: "underline" }}
                  >
                    Return to AI Menu
                  </button>
                </div>
                {ticketStatus === "idle" && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      // 🛡️ BLOCK DISCONNECTS: Lock out multiple rapid-fire clicks
                      if (ticketStatus === "submitting") return;
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
                          border: requestType === "sales" ? "2px solid #FFBF00" : "1px solid #1e293b",
                          backgroundColor: requestType === "sales" ? "#05292e" : "#022329", color: requestType === "sales" ? "#FFBF00" : "#94a3b8"
                        }}
                      >
                        🤝  Sales & Assets
                      </button>
                      <button
                        type="button"
                        onClick={() => setRequestType("admin")}
                        style={{
                          flex: 1, padding: "6px", borderRadius: "6px", fontSize: "10px", fontWeight: "bold", cursor: "pointer",
                          border: requestType === "admin" ? "2px solid #FFBF00" : "1px solid #1e293b",
                          backgroundColor: requestType === "admin" ? "#05292e" : "#022329", color: requestType === "admin" ? "#FFBF00" : "#94a3b8"
                        }}
                      >
                        ⚙️  Tech & Admin
                      </button>
                    </div>
                    {requestType === "sales" && (
                      <div ref={suggestionRef} style={{ position: "relative" }}>
                        <label style={{ fontSize: "9px", fontWeight: "bold", color: "#64748b", display: "block", marginBottom: "4px" }}>
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
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #1e293b", backgroundColor: "#022329", color: "#ffffff", fontSize: "11px", boxSizing: "border-box" }}
                        />

                        {/* Autocomplete Suggestions drop container overlay view context */}
                        {showSuggestions && assetSearch.trim() !== "" && filteredAssets.length > 0 && (
                          <div style={{
                            position: "absolute", bottom: "calc(100% + 4px)", left: 0, width: "100%",
                            backgroundColor: "#022329", border: "1px solid #1e293b", borderRadius: "8px",
                            maxHeight: "140px", overflowY: "auto", zIndex: 1010, boxShadow: "0 -4px 12px rgba(0,0,0,0.3)"
                          }}>
                            {filteredAssets.map((asset) => (
                              <div
                                key={asset.id}
                                onClick={() => {
                                  setAssetSearch(asset.product_code);
                                  setSelectedAssetObject(asset);
                                  setShowSuggestions(false);
                                  setInput(`Inquiry regarding Asset Ref: ${asset.product_code} (${asset.title}) - `);
                                }}
                                style={{ padding: "8px 12px", cursor: "pointer", borderBottom: "1px solid #1e293b", textAlign: "left" }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#05292e"}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                              >
                                <div style={{ fontSize: "11px", fontWeight: "bold", color: "#FFBF00" }}>{asset.product_code}</div>
                                <div style={{ fontSize: "10px", color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{asset.title}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {requestType === "admin" && (
                      <div>
                        <label style={{ fontSize: "9px", fontWeight: "bold", color: "#64748b", display: "block", marginBottom: "4px" }}>
                          What technical or administrative issue are you facing?
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Wallet Connect Error, Profile Update Bug"
                          value={customSubject}
                          onChange={(e) => setCustomSubject(e.target.value)}
                          required
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #1e293b", backgroundColor: "#022329", color: "#ffffff", fontSize: "11px", boxSizing: "border-box" }}
                        />
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={ticketStatus === "submitting"}
                      style={{
                        width: "100%", padding: "10px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold",
                        backgroundColor: ticketStatus === "submitting" ? "#1e293b" : "#FFBF00", color: "#020617",
                        border: "none", cursor: ticketStatus === "submitting" ? "not-allowed" : "pointer",
                      }}
                    >
                      {ticketStatus === "submitting" ? "Broadcasting Lead..." : "Confirm & Broadcast Lead  📡"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ─── STAGE 3: CHAT ROOM FIELD INTERFACE FOOTERS ─── */}
            {ticketStatus === "submitted" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>

                {showClosingCeremony ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                    <div style={{ textAlign: "center", fontSize: "11px", fontWeight: "bold", color: "#FFBF00" }}>
                      How was your support experience today?
                    </div>
                    <div style={{ display: "flex", gap: "10px", width: "100%", marginTop: "4px" }}>
                      <button
                        type="button"
                        onClick={async () => {
                          const activeId = localStorage.getItem("bazaria_active_ticket");
                          if (activeId) {
                            try {
                              const { doc, updateDoc } = await import("firebase/firestore");
                              await updateDoc(doc(db, "support_tickets", activeId), { rating: 5, score: 5, stars: 5, status: "closed" });
                            } catch (err) { console.error(err); }
                          }
                          executeMasterTeardown();
                        }}
                        style={{ flex: 1, padding: "12px 8px", borderRadius: "12px", border: "1px solid #334155", backgroundColor: "#1e293b", color: "#ffffff", fontSize: "14px", cursor: "pointer" }}
                      >
                        😊  <span style={{ display: "block", fontSize: "10px", fontWeight: "bold", color: "#2dd4bf", marginTop: "4px" }}>Great</span>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          const activeId = localStorage.getItem("bazaria_active_ticket");
                          if (activeId) {
                            try {
                              const { doc, updateDoc } = await import("firebase/firestore");
                              await updateDoc(doc(db, "support_tickets", activeId), { rating: 3, score: 3, stars: 3, status: "closed" });
                            } catch (err) { console.error(err); }
                          }
                          executeMasterTeardown();
                        }}
                        style={{ flex: 1, padding: "12px 8px", borderRadius: "12px", border: "1px solid #334155", backgroundColor: "#1e293b", color: "#ffffff", fontSize: "14px", cursor: "pointer" }}
                      >
                        😐  <span style={{ display: "block", fontSize: "10px", fontWeight: "bold", color: "#94a3b8", marginTop: "4px" }}>Okay</span>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          const activeId = localStorage.getItem("bazaria_active_ticket");
                          if (activeId) {
                            try {
                              const { doc, updateDoc } = await import("firebase/firestore");
                              await updateDoc(doc(db, "support_tickets", activeId), { rating: 1, score: 1, stars: 1, status: "closed" });
                            } catch (err) { console.error(err); }
                          }
                          executeMasterTeardown();
                        }}
                        style={{ flex: 1, padding: "12px 8px", borderRadius: "12px", border: "1px solid #334155", backgroundColor: "#1e293b", color: "#ffffff", fontSize: "14px", cursor: "pointer" }}
                      >
                        🙁  <span style={{ display: "block", fontSize: "10px", fontWeight: "bold", color: "#ef4444", marginTop: "4px" }}>Poor</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formEl = e.currentTarget;
                      const clientInputText = (formEl.elements.namedItem("clientMessage") as HTMLInputElement).value;
                      if (!clientInputText.trim()) return;

                      const activeTicketId = localStorage.getItem("bazaria_active_ticket");
                      if (!activeTicketId) return;

                      try {
                        const msgSubcollectionRef = collection(db, "support_tickets", activeTicketId, "messages");
                        await addDoc(msgSubcollectionRef, {
                          text: clientInputText.trim(),
                          sender: "client",
                          isAgent: false,
                          senderName: "Client",
                          createdAt: serverTimestamp(),
                          timestamp: new Date().toISOString()
                        });

                        const parentDocRef = doc(db, "support_tickets", activeTicketId);
                        await setDoc(parentDocRef, {
                          lastMessage: clientInputText.trim(),
                          lastUpdated: serverTimestamp()
                        }, { merge: true });

                        formEl.reset();
                      } catch (err) {
                        console.error("❌ Outbound Firestore transmission failed:", err);
                      }
                    }}
                    style={{ display: "flex", gap: "8px", alignItems: "center", width: "100%" }}
                  >
                    <input
                      name="clientMessage"
                      type="text"
                      placeholder={requestType === "admin" ? "Type a message to admin staff..." : "Type a message to the agent..."}
                      required
                      style={{ flex: 1, padding: "10px 14px", borderRadius: "20px", border: "1px solid #1e293b", backgroundColor: "#022329", color: "#ffffff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                    />
                    <button
                      type="submit"
                      style={{
                        backgroundColor: "#FFBF00", color: "#020617", border: "none",
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

        {/* 🛡️ GUARD LAYER: Base AI input workspace remains active across Triage Stages 1 & 2 */}
        {ticketStatus !== "submitted" && (
          <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
            
            {/* Suggestion Prompt Chips */}
            {!isSupportMode && (
              <div style={{ padding: "10px 20px", backgroundColor: "#ffffff", display: "flex", gap: "8px", overflowX: "auto", borderBottom: "1px solid #f1f5f9" }}>
                <button
                  type="button"
                  onClick={() => suggestPrompt("Are there any premium assets available?")}
                  style={{ padding: "6px 12px", backgroundColor: "#f1f5f9", border: "none", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", color: "#475569", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  🔍  Browse Assets
                </button>
                <button
                  type="button"
                  onClick={() => suggestPrompt("How do I establish a storefront?")}
                  style={{ padding: "6px 12px", backgroundColor: "#f1f5f9", border: "none", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", color: "#475569", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  🏪  Create Storefront
                </button>
              </div>
            )}

            {/* Core AI Concierge Input Workspace Form Container */}
            <div style={{ padding: "16px 20px" }}>
              <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isSupportMode ? "Ask the AI while setting up your ticket..." : "Ask the AI Concierge a question..."}
                  style={{ flex: 1, padding: "10px 14px", borderRadius: "20px", border: "1px solid #cbd5e1", outline: "none" }}
                />
                <button
                  type="submit"
                  style={{ backgroundColor: "#05292e", color: "#FFBF00", border: "none", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
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
