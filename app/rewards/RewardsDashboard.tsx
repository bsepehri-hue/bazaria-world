"use client";


import React, { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase"; 
import { storage } from "@/lib/firebase/client"; // Keep storage where it was if needed
import { useAuth } from "@/app/providers/AuthProvider"; 

// 🔄 COMBINED & UNIFIED IN-LINE IMPORTS (No more duplicate crashers!)
import { 
  doc, 
  setDoc,
  updateDoc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  addDoc,
  serverTimestamp,
  limit,      // 👈 NEW
  orderBy     // 👈 NEW
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { getProductCode } from "@/lib/utils"; 
import MilestoneTracker from '@/components/MilestoneTracker';
import { Zap, Building2, UserPlus } from "lucide-react";
import AgentLinkBuilder from "@/components/dashboard/AgentLinkBuilder";
import { AgentSupportDrawer } from "@/components/ui/AgentSupportDrawer";
import AgentNotificationRegister from "@/components/ui/AgentNotificationRegister";

// 🛡️ 1. Define the interfaces
interface Inquiry {
  id: string;
  customer_id: string;
  subject: string;
  message: string;
  created_at: string;
  product_code?: string;
  xid_chain?: { parent?: string };
}

interface CorporateLead {
  id: string;
  companyName: string;
  industry: string;
  estimatedListings: string;
  status: string;
}

// 🚀 2. THE MAIN COMPONENT
export default function RewardsDashboard() { 
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // 🛡️ PartnerData tracking state
  const [partnerData, setPartnerData] = useState({
    paid: 15000.00,
    available: 540.00,
    credits: 12,
    listings: 5,
    tier: "Elite Partner (M5)",
    name: "Bo Dango",
    academyLevel: 3,
    volumeCapacity: 5000000,
    countryCode: "US" 
  });

  const [activeTickets, setActiveTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [corporateLeads, setCorporateLeads] = useState<CorporateLead[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [agentAvatar, setAgentAvatar] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [activeChatRoom, setActiveChatRoom] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [syncDescription, setSyncDescription] = useState("");
  const [syncXid, setSyncXid] = useState("");
  const [liveRouterAssets, setLiveRouterAssets] = useState<any[]>([]);

  // 🧰 BULK QUOTE BUILDER STATES
  const [inputItem, setInputItem] = useState("car");
  const [inputTitle, setInputTitle] = useState("");
  const [inputQty, setInputQty] = useState("1");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleBuildQuoteLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle) return;
    const formattedTitle = inputTitle.trim().replace(/\s+/g, "-");
    const cleanQty = Math.max(1, parseInt(inputQty || "1", 10));
    const agentRef = user?.uid ? user.uid.substring(0, 6).toUpperCase() : "SYSTEM";
    
    const origin = typeof window !== "undefined" ? window.location.origin : "https://bazaria.world";
    const newLink = `${origin}/pay?agent=${agentRef}&item=${inputItem}&title=${formattedTitle}&qty=${cleanQty}`;
    
    setGeneratedLink(newLink);
    setCopied(false);
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const [agentFields, setAgentFields] = useState({
    email: "xavier@bazaria.agency",
    phone: "+1 (305) 555-7742",
    location: "Miami, FL"
  });

// 🔍 1. TWO-TIER PROPERTY-AWARE LOCATOR (REALIGNED & COMPLETED)
  const activeTicketData = React.useMemo(() => {
    if (!activeChatRoom) return null;
    const roomStr = String(activeChatRoom);

    // Deep property matcher looks at both document IDs and internal fields
    const matcher = (t: any) => {
      if (!t) return false;
      return (
        String(t.id || "") === roomStr || 
        String(t.ticketId || "") === roomStr || 
        String(t.inquiryId || "") === roomStr ||
        String(t.data?.ticketId || "") === roomStr ||
        String(t.data?.inquiryId || "") === roomStr
      );
    };

    // Tier 1: Check claimed/active tickets array
    const foundInActive = activeTickets.find(matcher);
    if (foundInActive) return foundInActive;

    // Tier 2 Fallback: Check open inquiries queue array
    const foundInInquiries = inquiries.find(matcher);
    if (foundInInquiries) return foundInInquiries;

    // 🎯 Tier 3 True Reverse-Lookup: If activeChatRoom is set to a doc ID hash, 
    // find the record by its container ID so we can unlock its nested custom ticketId!
    const reverseMatch = activeTickets.find(t => String(t.id || "") === roomStr) || 
                         inquiries.find(t => String(t.id || "") === roomStr);
    
    return reverseMatch || null;
  }, [activeTickets, inquiries, activeChatRoom]);

  // 🎯 UNIFIED LIFECYCLE & BROADCAST INTERCEPTOR ECOSYSTEM
  useEffect(() => {
    // 1. Core Synchronizer: Runs whenever activeTicketData shifts locally
    if (activeTicketData) {
      const derivedDesc = activeTicketData.subject 
        ? activeTicketData.subject.split('[Ref:')[0].trim() 
        : activeTicketData.message || activeTicketData.lastMessage || "";
        
      let derivedXid = "";
      
      if (activeTicketData.product_code && typeof activeTicketData.product_code === 'string') {
        const cleanCode = activeTicketData.product_code.toUpperCase().replace("XID-", "").trim();
        derivedXid = `XID-${cleanCode}`;
      } else if (activeTicketData.xid && typeof activeTicketData.xid === 'string') {
        const cleanCode = activeTicketData.xid.toUpperCase().replace("XID-", "").trim();
        derivedXid = `XID-${cleanCode}`;
      } else {
        const subjectStr = activeTicketData.subject || "";
        const match = subjectStr.match(/XID-[A-Z0-9]{5}/i);
        derivedXid = match ? match[0].toUpperCase() : "";
      }

      setSyncDescription(derivedDesc);
      setSyncXid(derivedXid);
    } else if (!activeChatRoom) {
      // 🚨 ONLY wipe inputs if there is absolutely no active ticket channel selected at all
      setSyncDescription("");
      setSyncXid("");
    }

    // 2. Global Event Interceptor: Catches concurrent window broadcasts from layout frame
    const handleGlobalTicketSync = (event: Event) => {
      const customEvent = event as CustomEvent;
      const ticket = customEvent.detail?.ticket || customEvent.detail;
      
      if (!ticket) return;
      
      console.log("🎯 RewardsDashboard: Syncing payload with verified keys:", ticket);
      
      // ✅ 1. Set the room string ID to the custom tkt_gen code cleanly
      if (typeof setActiveChatRoom === "function") {
        setActiveChatRoom(ticket.ticketId || "");
      }

      // 🗑️ (THE DELETED DUPLICATE/CRASHING LINES WERE REMOVED FROM HERE)

      const targetXid = ticket.product_code || ticket.xid || "";
      let derivedXid = "";
      
      if (targetXid && typeof targetXid === 'string') {
        derivedXid = targetXid.toUpperCase().includes("XID-") 
          ? targetXid.toUpperCase() 
          : `XID-${targetXid.toUpperCase()}`;
      } else {
        const rawSubject = ticket.subject || "";
        const match = rawSubject.match(/XID-[A-Z0-9]{5}/i);
        derivedXid = match ? match[0].toUpperCase() : "";
      }

      if (typeof setSyncXid === "function") {
        setSyncXid(derivedXid);
      }

      const rawSubjectText = ticket.subject || "";
      const derivedDesc = rawSubjectText.includes('[Ref:')
        ? rawSubjectText.split('[Ref:')[0].trim()
        : ticket.message || ticket.lastMessage || "";

      if (typeof setSyncDescription === "function") {
        setSyncDescription(derivedDesc);
      }
    };

    window.addEventListener("open-ai-concierge", handleGlobalTicketSync);
    return () => window.removeEventListener("open-ai-concierge", handleGlobalTicketSync);
    // 🎯 Make sure to add your active ticket data setter to the dependency array if needed:
  }, [activeTicketData, activeChatRoom, setActiveChatRoom, setSyncXid, setSyncDescription]);

 // 📡 SECURE DISPATCH: Transmit operational logs directly to room sub-collection
const handleSendMessage = async () => {
    if (!newMessageText.trim()) return;

    // 🎯 REDESIGN ROOT ALIGNMENT:
    // Target the absolute Firestore Document ID directly from the active metadata payload.
    const trueRoomId = activeTicketData?.id || activeChatRoom;

    if (!trueRoomId) {
      console.error("❌ ABORT: Agent cannot send message. No active ticket document ID found.");
      return;
    }

    const messageToSend = newMessageText.trim();
    setNewMessageText("");

    console.log(`📡 UNIFIED ROUTER -> Pushing data straight to path: /support_tickets/${trueRoomId}/messages`);

    try {
      const messagesCollectionRef = collection(db, "support_tickets", trueRoomId, "messages");
      
      await addDoc(messagesCollectionRef, {
        text: messageToSend,
        senderUid: user?.uid || "SYSTEM",
        senderName: partnerData?.name || "Bo Dango",
        createdAt: serverTimestamp(), 
        sender: "agent",
        timestamp: new Date().toISOString(),
        isAgent: true
      });

      // Synchronize metadata track document and set chatMode to agent to signal AI to step down
      const ticketDocRef = doc(db, "support_tickets", trueRoomId);
      await setDoc(ticketDocRef, {
        lastMessage: messageToSend,
        updatedAt: serverTimestamp(),
        chatMode: "agent_active", // 👈 Signals AI concierge to stop auto-responding
        status: "open"
      }, { merge: true });

      console.log("✅ Transmission successfully synced to unified thread.");

    } catch (error) {
      console.error("❌ Outbound delivery dropped:", error);
      setNewMessageText(messageToSend);
    }
  };
  
// 🔌 CONSOLIDATED WORKSPACE DATA PIPELINE LAYER
useEffect(() => {
  if (authLoading) return;
  
  // 💥 THE RESET GATE: If no user session exists, kill the entire thread instantly
  if (!user?.uid) {
    const currentPath = window.location.pathname;
    
    // If we are already running away to the login page or market, freeze execution completely
    if (currentPath === '/login' || currentPath === '/') {
      return; 
    }

    // Force an absolute window reload to clear the history stack and break the viem pool memory
    window.location.replace("/login?callback=/rewards");
    return; 
  }

  // 🛡️ Double-lock guard: Do NOT fetch data if the user object is unauthenticated
  if (!user || !user.uid) return;

  // 🟢 Safe zone: Data pipelines will only open if a valid user is physically verified
  setLoadingData(true);
  setLoadingTickets(true);
  setLoadingInquiries(true); // Set loading state for inquiries here
  
  // 📡 1. Cleanly integrated API inquiry loader
  const fetchInquiries = async () => {
    try {
      const response = await fetch("/api/inquiries");
      const result = await response.json();
      if (result.success) {
        setInquiries(result.data);
      }
    } catch (err) {
      console.error("Failed to load inquiries", err);
    } finally {
      setLoadingInquiries(false);
    }
  };
  
  fetchInquiries();

 // 📂 2. Live Firestore Realtime Stream Subscriptions
  const unsubPartner = onSnapshot(doc(db, "partners", user.uid), (docSnap) => {
    if (docSnap.exists()) {
      setPartnerData(prev => ({ ...prev, ...docSnap.data() }));
    }
    setLoadingData(false);
  });

  const unsubUser = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
    if (docSnap.exists()) {
      const userData = docSnap.data();
      setAgentFields({
        email: userData.email || user.email || "xavier@bazaria.agency",
        phone: userData.phone || "+1 (305) 555-7742",
        location: userData.location || "Miami, FL"
      });
      if (userData.avatarUrl || userData.photoURL || userData.imageUrl) {
        setAgentAvatar(userData.avatarUrl || userData.photoURL || userData.imageUrl);
      }
    }
  });

  const qPartners = query(
    collection(db, "partner_intake"),
    where("status", "==", "available")
  );
  const unsubLeads = onSnapshot(qPartners, (snapshot) => {
    const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CorporateLead[];
    setCorporateLeads(leads);
  });

  const ticketsRef = collection(db, "support_tickets");
  
  const targetQuery = partnerData.tier === "Global Admin"
    ? query(ticketsRef, where("status", "==", "open"))
    : query(ticketsRef, where("status", "==", "open"), where("countryCode", "==", partnerData.countryCode || "US"));

  const unsubTickets = onSnapshot(targetQuery, (snapshot) => {
    const fetchedTickets = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    setActiveTickets(fetchedTickets);
    setLoadingTickets(false);
  }, (error) => {
    console.error("Geofenced data pipeline error:", error);
    setLoadingTickets(false);
  });

  // 📡 3. Live Marketplace Stream for the Global Router ($10k+ High-Ticket Filter)
  const qRouter = query(
    collection(db, "listings"),
    where("status", "==", "active"), 
    limit(50) 
  );
  
  const unsubRouter = onSnapshot(qRouter, (snapshot) => {
    const liveAssets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // 🛑 STRICT $10,000+ HIGH-TICKET FILTER
    const highTicketAssets = liveAssets.filter((asset: any) => {
      const itemPrice = 
        Number(asset.buyNowPrice) || 
        Number(asset.price) || 
        Number(asset.currentBid) || 
        Number(asset.startingBid) || 
        0;
        
      return itemPrice >= 10000;
    });

    // Display top 4 qualifying assets
    setLiveRouterAssets(highTicketAssets.slice(0, 4));
  });

 // Clean cleanup cycle
  return () => {
    unsubPartner();
    unsubUser();
    unsubLeads();
    unsubTickets();
    unsubRouter(); // 👈 DON'T FORGET THIS LINE!
  };
  
}, [user, authLoading, partnerData.countryCode, partnerData.tier]); // Make sure to delete the old isolated fetchInquiries useEffect below this!

  // Stream active lead inquiries from API
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await fetch("/api/inquiries");
        const result = await response.json();
        if (result.success) {
          setInquiries(result.data);
        }
      } catch (err) {
        console.error("Failed to load inquiries", err);
      } finally {
        setLoadingInquiries(false);
      }
    };
    
    fetchInquiries();
  }, []);

// 📡 Live Chat Subcollection Sync Hook (REDESIGNED FOR UNIFIED PIPELINE)
  useEffect(() => {
    // 🎯 THE MASTER GUARD: If the close button set activeChatRoom to null, abort immediately!
    if (!activeChatRoom) {
      console.log("🛡️ Master Guard: Chat room closed. Killing live message stream reconnects.");
      return;
    }

    const targetDocumentId = activeChatRoom || activeTicketData?.id;
    if (!targetDocumentId) return;

    console.log(`🔌 Unified Stream connecting to collection path: /support_tickets/${targetDocumentId}/messages`);

    const messagesRef = collection(db, "support_tickets", targetDocumentId, "messages");
    const qMessages = query(messagesRef);

    const unsubChat = onSnapshot(qMessages, (snapshot) => {
      const msgs = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      
      // Chronological sort ensuring local timestamps match Firebase serverTime seamlessly
      msgs.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.timestamp).getTime();
        const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.timestamp).getTime();
        return timeA - timeB;
      });
      
      setChatMessages(msgs);
    }, (error) => {
      console.error("Live message room connection failed:", error);
    });

    return () => unsubChat();
  }, [activeTicketData?.id, activeChatRoom]); // 🎯 Track primitive ID strings to completely defeat volatile object re-render loops!
    

  // 🔌 WIRE 2: FIREBASE STORAGE CLOUD PICTURE UPLOAD PIPELINE
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const localUrl = URL.createObjectURL(file);
    setAgentAvatar(localUrl);
    setIsUploadingAvatar(true);

    try {
      const storageRef = ref(storage, `avatars/${user.uid}/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const permanentCloudUrl = await getDownloadURL(uploadResult.ref);

      await updateDoc(doc(db, "users", user.uid), {
        avatarUrl: permanentCloudUrl
      });

      setAgentAvatar(permanentCloudUrl);
      alert("Identity headshot synced with secure cloud storage successfully!");
    } catch (err) {
      console.error("Failed to upload profile picture to cloud:", err);
      alert("Cloud sync failed. Preserving localized memory runtime path.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

 // Profile Information Save Data Action (Upgraded)
  const handleSaveProfileFields = async (updatedName: string, updatedPhone: string, updatedLocation: string, updatedAddress: string) => {
    if (!user) return;
    try {
      // 1. Update the primary authentication registry
      await updateDoc(doc(db, "users", user.uid), {
        name: updatedName,
        phone: updatedPhone,
        location: updatedLocation,
        address: updatedAddress // 👈 New debit card mailing address
      });
      
      // 2. Synchronize the partner matrix node
      await updateDoc(doc(db, "partners", user.uid), {
        name: updatedName,
        address: updatedAddress
      });
      
      setIsEditingProfile(false);
      alert("Operational profile and secure mailing address updated successfully!");
    } catch (err) {
      console.error("Failed to update profile nodes:", err);
      alert("Failed to write fields to authentication registry.");
    }
  };

  // 🎯 FUNCTION 1: Standard Inquiry Claim
  const handleClaim = async (inquiryId: string) => {
    if (!user) return;
    setClaimingId(inquiryId);
    try {
      const response = await fetch("/api/inquiries/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId,
          agentId: user.uid,
          setupCode: `BAZ-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
        }),
      });

      const result = await response.json();
      if (result.success) {
        setInquiries(inquiries.filter((item) => item.id !== inquiryId));
        alert("Inquiry claimed successfully. Assigned as representative!");
      } else {
        alert("Claim failed: Lead was already claimed by another agent.");
      }
    } catch (err) {
      console.error("Error claiming lead:", err);
    } finally {
      setClaimingId(null);
    }
  };

  // 🎯 FUNCTION 2: Corporate Partner Intake Claim
  const handleClaimPartner = async (leadId: string) => {
    if (!user) return;
    try {
      const leadRef = doc(db, "partner_intake", leadId);
      await updateDoc(leadRef, {
        status: "assigned",
        agentUid: user.uid,
        claimedAt: serverTimestamp(),
      });
      alert("Corporate Stewardship Secured! Check your Managed Partners.");
    } catch (err) {
      console.error("Claim failed:", err);
    }
  };
  
  const copyToClipboard = (type: string) => {
    const refId = user?.uid?.substring(0, 5).toUpperCase() || "BO";
    const link = `bazaria.world/join?type=${type}&ref=${refId}`;
    navigator.clipboard.writeText(link);
    alert(`${type === 'merchant' ? 'Merchant' : 'Partner'} Invite Link Copied!`);
  };

  const s = {
    wrapper: { backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b', fontFamily: 'sans-serif' },
    container: { padding: '40px', maxWidth: '1400px', margin: '0 auto' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', flexWrap: 'wrap' as const, gap: '20px' },
    refBox: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '12px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' },
    card: { backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '32px', padding: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' },
    miniStatCardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px', marginBottom: '32px' },
    miniStatCard: { backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '32px', padding: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' },
    miniStatCardTitle: { fontWeight: '900', textTransform: 'uppercase' as const, fontSize: '14px', marginBottom: '32px' },
    miniStat: { padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' },
    badge: { padding: '8px 16px', borderRadius: '12px', fontSize: '10px', fontWeight: '900' as const, textTransform: 'uppercase' as const, letterSpacing: '1px', textAlign: 'center' as const },
    btnText: { background: 'none', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '12px', fontSize: '10px', fontWeight: '900' as const, color: '#64748b', cursor: 'pointer' },
    urgentMini: { backgroundColor: '#05292e', borderLeft: '4px solid #0d9488', borderRadius: '20px', padding: '24px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }
  };

  if (authLoading) return <div className="p-20 text-center font-black text-teal-600">PROTOCOL SYNCING...</div>;

  return (
    <div style={s.wrapper}>
      <div style={s.container}>
        
        {/* ⚡ URGENT MINI - WORKBENCH */}
        <div style={s.urgentMini}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ fontSize: '24px' }}>⚡</div>
            <div>
              <p style={{ margin: 0, fontSize: '9px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Unassigned Pool Inquiries</p>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#fff' }}>LIVE LISTING AGENT WORKBENCH</h3>
            </div>
          </div>
        </div>

        {/* 🚀 HEADER */}
        <div style={s.headerRow}>
          <div>
            <h1 style={{ fontSize: '42px', fontWeight: '900', margin: 0, letterSpacing: '-1.5px', color: '#0f172a' }}>
              Partner <span style={{ color: '#94a3b8', fontWeight: '300' }}>Command</span>
            </h1>
            <p style={{ color: '#0d9488', fontSize: '12px', fontWeight: '600', marginTop: '4px', textTransform: 'uppercase' }}>
              Official Success Partner Console
            </p>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={s.refBox}>
              <button onClick={() => copyToClipboard('merchant')} style={s.btnText}>COPY MERCHANT LINK</button>
            </div>
            <div style={s.refBox}>
              <button onClick={() => copyToClipboard('partner')} style={s.btnText}>COPY PARTNER LINK</button>
            </div>
          </div>
        </div>

        {/* 🏆 AGENT MILESTONE AUTOMATION LEDGER */}
        <div style={{ width: '100%', marginTop: '24px', marginBottom: '24px' }}>
          <MilestoneTracker currentLtb={340} targetLtb={500} />
        </div>

        {/* 🎛️ NAVIGATION WORKSPACE (MOBILE-OPTIMIZED SWIPE TRACK) */}
        <div style={{ position: 'relative', width: '100%', marginBottom: '24px' }}>
          
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '32px',
            background: 'linear-gradient(to left, #ffffff, transparent)', 
            pointerEvents: 'none',
            zIndex: 10,
            borderRadius: '12px'
          }} />

         <div
            id="mobile-nav-track"
            style={{
              display: 'flex',
              flexWrap: 'wrap', /* 👈 NEW: Forces buttons to wrap instead of running off-screen */
              alignItems: 'center',
              gap: '10px',
              borderBottom: '2px solid #1e293b',
              paddingBottom: '14px',
              fontFamily: 'sans-serif',
            }}
          >
            <style>{`
              #mobile-nav-track::-webkit-scrollbar {
                display: none;
              }
            `}</style>

           {['Overview', 'Active Marketplace', 'Live Support Desk', 'Credentials & Vault'].map((tabName) => {
  const isActive = activeTab === tabName; 
  return (
    <button
      key={tabName}
      onClick={(e) => {
        e.preventDefault();
        setActiveTab(tabName);
        if (e.currentTarget) {
          e.currentTarget.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }
      }}
      style={{
        background: isActive ? '#FFBF00' : '#1e293b', 
        color: isActive ? '#020617' : '#ffffff', 
        border: isActive ? '1px solid #FFBF00' : '1px solid #334155',
        padding: '12px 22px', 
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: isActive ? '0 4px 12px rgba(255, 191, 0, 0.2)' : 'none',
        display: 'flex',       // Added to keep text and badge aligned cleanly
        alignItems: 'center',
        gap: '6px'
      }}
    >
      {tabName}
      
      {/* 🟢 The Notification Badge is safely back inside the button boundaries! */}
      {tabName === 'Live Support Desk' && activeTickets.length > 0 && (
        <span style={{ 
          backgroundColor: '#ef4444', 
          color: '#ffffff', 
          fontSize: '10px', 
          padding: '2px 6px', 
          borderRadius: '9999px',
          fontWeight: 700 
        }}>
          {activeTickets.length}
        </span>
      )}
    </button>
  );
})}
          </div>
        </div>

        {/* 🎛️ INTEGRATED SPLIT COLUMNS VIEWPORTS */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '32px',
          alignItems: 'flex-start',
          width: '100%',
          fontFamily: 'sans-serif'
        }}>

          {/* 🪪 LEFT COLUMN: AGENT CARD SUMMARY DOCUMENT */}
          <div style={s.card}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              
              {/* 📸 INTERACTIVE AVATAR UPLOAD ELEMENT */}
              <label style={{ position: 'relative', cursor: 'pointer' }}>
                <img 
                  src={agentAvatar || user?.photoURL || user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"} 
                  alt="Profile" 
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #0d9488', opacity: isUploadingAvatar ? 0.5 : 1 }} 
                />
                <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#05292e', color: '#fff', fontSize: '8px', padding: '2px 6px', borderRadius: '4px', fontWeight: 900 }}>
                  {isUploadingAvatar ? 'SYNCING...' : 'UPLOAD'}
                </span>
                {/* 🔌 The hidden input that fires the Firebase Storage pipeline */}
                <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} disabled={isUploadingAvatar} />
              </label>

              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>{partnerData?.name || "Bo Dango"}</h2>
                  
                  {/* ⚙️ ACTIVATED EDIT BUTTON */}
                  <button 
                    onClick={() => setIsEditingProfile(true)} 
                    style={{ backgroundColor: 'transparent', border: '1px solid #e2e8f0', padding: '4px 8px', borderRadius: '8px', fontSize: '9px', fontWeight: 900, color: '#64748b', cursor: 'pointer', transition: 'all 0.2s hover:bg-slate-50' }}
                  >
                    ⚙️ EDIT INFO
                  </button>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#0d9488', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Certified Success Partner</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', width: '100%', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase' }}>Academy Level</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: 900, color: '#d97706' }}>LVL 3</p>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase' }}>Volume Capacity</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>$5.0M</p>
              </div>
            </div>

            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '12px', textAlign: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', color: '#166534', fontWeight: 900 }}>🟢 STATUS: ACTIVE NODE</span>
            </div>

            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '12px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '11px', color: '#92400e', fontWeight: 900 }}>💼 LICENSE TIER: ELITE PARTNER (M5)</span>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase' }}>Direct Correspondence</span>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', fontWeight: 600 }}>{user?.email || "bodango@gmail.com"}</p>
              </div>
              <div>
                <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase' }}>Secure Comm Line</span>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', fontWeight: 600 }}>+1 (305) 555-7742</p>
              </div>
              <div>
                <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase' }}>Operational Hub</span>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', fontWeight: 700 }}>📍 Miami, FL</p>
              </div>
            </div>
          </div>

          {/* 🎛️ RIGHT COLUMN: DYNAMIC SUB-WORKSPACE CONSOLE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', flexGrow: 2 }}>
            
            {/* ---------------------------------------------------------------- */}
            {/* TAB 1: OVERVIEW WORKSPACE                                        */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'Overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* 🏢 CORPORATE STEWARDSHIP POOL */}
                {corporateLeads.length > 0 && (
                  <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <Building2 size={20} color="#0d9488" />
                      <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Available Corporate Partners
                      </h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                      {corporateLeads.map((lead) => (
                        <div key={lead.id} style={{ ...s.card, border: '2px solid #0d9488', position: 'relative', overflow: 'hidden' }}>
                          <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#0d9488', color: '#fff', padding: '4px 12px', fontSize: '9px', fontWeight: 900 }}>
                            AVAILABLE
                          </div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 900 }}>{lead.companyName}</h4>
                          <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{lead.industry} • {lead.estimatedListings} Est. Listings</p>
                          <button
                            onClick={() => handleClaimPartner(lead.id)}
                            style={{
                              marginTop: '20px',
                              width: '100%',
                              backgroundColor: '#0f172a',
                              color: '#fff',
                              border: 'none',
                              padding: '10px',
                              borderRadius: '12px',
                              fontWeight: 900,
                              fontSize: '11px',
                              cursor: 'pointer'
                            }}
                          >
                            SECURE STEWARDSHIP
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* INQUIRY POOL */}
                <div style={{ marginBottom: '16px' }}>
                  {loadingInquiries ? (
                    <p style={{ color: '#0d9488', fontWeight: '600' }}>Checking for available pool inquiries...</p>
                  ) : inquiries.length === 0 ? (
                    <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <p style={{ color: '#64748b', margin: 0, fontWeight: '600' }}>No new inquiries in the pool right now. Check back shortly!</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                      {inquiries.map((inq) => {
                        const displayCode = inq.product_code || (inq.xid_chain?.parent ? getProductCode(inq.xid_chain.parent) : "GENERAL");
                        const cleanSubject = inq.subject.replace(/\s*\[Ref:\s*#[A-Z0-9]{5}\]/gi, "").replace(/\s*\[PROD-[A-Z0-9]{5}\]/gi, "");
                        return (
                          <div key={inq.id} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '230px', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '10px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '6px', fontWeight: 900 }}>UNASSIGNED LEAD</span>
                                <span style={{ fontSize: '10px', backgroundColor: '#05292e', color: '#FFBF00', border: '1px solid #FFBF00', padding: '4px 8px', borderRadius: '6px', fontWeight: 900, fontFamily: 'monospace' }}>#{displayCode}</span>
                              </div>
                              <h4 style={{ fontSize: '16px', margin: '0 0 8px 0', fontWeight: '900', color: '#0f172a' }}>{cleanSubject}</h4>
                              <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.4', marginBottom: '20px' }}>{inq.message}</p>
                            </div>
                            <button onClick={() => handleClaim(inq.id)} disabled={claimingId === inq.id} style={{ width: '100%', backgroundColor: '#0d9488', border: 'none', color: '#fff', padding: '12px', borderRadius: '12px', fontWeight: '900', fontSize: '11px', cursor: claimingId === inq.id ? 'not-allowed' : 'pointer', opacity: claimingId === inq.id ? 0.6 : 1 }}>
                              {claimingId === inq.id ? 'CLAIMING...' : 'ACCEPT DEAL & ASSIGN'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', width: '100%', overflow: 'hidden' }}>
                  <div style={s.card}>
                    <h3 style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '13px', color: '#475569', marginBottom: '20px' }}>Capital Flow</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '900', margin: 0 }}>PAID</p>
                        <b style={{ fontSize: '22px', color: '#10b981' }}>${partnerData?.paid?.toLocaleString() || "0"}</b>
                      </div>
                      <div>
                        <p style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '900', margin: 0 }}>AVAILABLE</p>
                        <b style={{ fontSize: '22px', color: '#0f172a' }}>${partnerData?.available?.toLocaleString() || "0"}</b>
                      </div>
                    </div>
                  </div>
                  <div style={{ ...s.card, backgroundColor: '#0f172a', color: '#fff' }}>
                    <h3 style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '11px', color: '#94a3b8', marginBottom: '12px' }}>Yield Projector  📈 </h3>
                    <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '0' }}>$180,000<span style={{ fontSize: '13px', color: '#10b981' }}>/yr</span></h2>
                  </div>
                </div>

                {/* BULK QUOTE LINK BUILDER */}
                <div style={{ backgroundColor: "#05292e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "32px", boxSizing: "border-box" }}>
                  <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "16px", marginBottom: "24px" }}>
                    <h2 style={{ fontSize: "15px", fontWeight: 900, color: "#C5A059", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                       📝 Internal Broker Workspace: Bulk Quote Link Builder
                    </h2>
                    <p style={{ margin: "6px 0 0 0", color: "#94a3b8", fontSize: "12px" }}>
                      Configure client needs, define multi-unit quantities, and extract a portable transaction URL.
                    </p>
                  </div>
                  <form onSubmit={handleBuildQuoteLink} style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{ color: "#cbd5e1", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Asset Category</label>
                      <select value={inputItem} onChange={(e) => setInputItem(e.target.value)} style={{ backgroundColor: "#021a1d", border: "1px solid rgba(255,255,255,0.08)", padding: "12px 14px", borderRadius: "10px", color: "#ffffff", fontSize: "13px", outline: "none", width: "100%", boxSizing: "border-box" }}>
                        <option value="car">Automotive Listing ($10/ea)</option>
                        <option value="home">Real Estate Listing ($29/ea)</option>
                        <option value="heavy">Heavy Machinery ($49/ea)</option>
                      </select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{ color: "#cbd5e1", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Quantity Needed</label>
                      <input type="number" min="1" required placeholder="e.g., 20" value={inputQty} onChange={(e) => setInputQty(e.target.value)} style={{ backgroundColor: "#021a1d", border: "1px solid rgba(255,255,255,0.08)", padding: "12px 14px", borderRadius: "10px", color: "#ffffff", fontSize: "13px", outline: "none", width: "100%", boxSizing: "border-box" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", gridColumn: "span 2" }}>
                      <label style={{ color: "#cbd5e1", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Detailed Asset Title / Dealer Name</label>
                      <input type="text" required placeholder="e.g., Miami Auto Group 20 Car Allocation Package" value={inputTitle} onChange={(e) => setInputTitle(e.target.value)} style={{ backgroundColor: "#021a1d", border: "1px solid rgba(255,255,255,0.08)", padding: "12px 14px", borderRadius: "10px", color: "#ffffff", fontSize: "13px", outline: "none", width: "100%", boxSizing: "border-box" }} />
                    </div>
                    <button type="submit" style={{ gridColumn: "span 2", backgroundColor: "#C5A059", border: "none", padding: "14px", borderRadius: "10px", color: "#021a1d", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", cursor: "pointer", marginTop: "8px" }}>Generate Bulk Quote Link</button>
                  </form>
                  
                  {generatedLink && (
                    <div style={{ marginTop: "24px", backgroundColor: "#021a1d", padding: "20px", borderRadius: "14px", border: "1px solid rgba(16,185,129,0.15)" }}>
                      <span style={{ color: "#10b981", fontSize: "11px", fontWeight: 900, display: "block", marginBottom: "8px", textTransform: "uppercase" }}>
                         ✅ Portable Client URL Ready
                      </span>
                      <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                        <div style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", padding: "12px", borderRadius: "8px", fontFamily: "monospace", fontSize: "12px", color: "#cbd5e1", flex: 1, whiteSpace: "nowrap", overflowX: "hidden", textOverflow: "ellipsis" }}>{generatedLink}</div>
                        <button onClick={handleCopyLink} style={{ border: "none", display: "flex", alignItems: "center", gap: "6px", padding: "0 18px", borderRadius: "8px", fontSize: "12px", fontWeight: 900, cursor: "pointer", backgroundColor: copied ? "#10b981" : "#C5A059", color: copied ? "#ffffff" : "#021a1d" }}>
                           {copied ? "Copied!" : "Copy Link"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* TAB 2: ACTIVE MARKETPLACE REFERRAL ENGINE                        */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'Active Marketplace' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ backgroundColor: '#0b1329', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '16px', fontWeight: 900 }}>Global Marketplace Router</h4>
                    <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>Grab secure tracking links to circulate inside your online channels.</p>
                  </div>

                  {/* LIVE INVENTORY FEED */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {liveRouterAssets.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "20px", color: "#64748b", fontSize: "12px", border: "1px dashed #1e293b", borderRadius: "12px" }}>
                        Scanning marketplace for active premium inventory...
                      </div>
                    ) : (
                      liveRouterAssets.map((asset, index) => {
                        // 🤖 Smart Icon Selector based on Category
                        const cat = (asset.category || "").toLowerCase();
                        let icon = "💎";
                        if (cat.includes("auto") || cat.includes("car")) icon = "🚗";
                        else if (cat.includes("home") || cat.includes("property") || cat.includes("estate")) icon = "🏡";
                        else if (cat.includes("marine") || cat.includes("boat")) icon = "🛥️";
                        else if (cat.includes("digital") || cat.includes("nft") || cat.includes("crypto")) icon = "🌐";
                        else if (cat.includes("heavy") || cat.includes("machine")) icon = "🚜";

                        return (
                          <div key={asset.id || index} style={{ backgroundColor: '#030712', padding: '16px', borderRadius: '16px', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ fontSize: '24px' }}>{icon}</div>
                              <div>
                                <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '13px', textTransform: 'capitalize' }}>
                                  {asset.title || asset.name || "Premium Asset"}
                                </p>
                                <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                                  Ref Hook: {user?.uid ? user.uid.substring(0, 6).toUpperCase() : 'BAZARIA'} • {asset.category || "General"}
                                </span>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                const baseLink = `https://bazaria.world/market/asset/${asset.id}`;
                                const refCode = user?.uid ? user.uid.substring(0, 6).toUpperCase() : 'BAZARIA';
                                navigator.clipboard.writeText(`${baseLink}?agentRef=${refCode}`);
                                alert(`Custom Tracker for ${asset.title || "Asset"} Copied to Clipboard!`);
                              }} 
                              style={{ backgroundColor: 'transparent', border: '1px solid #FFBF00', color: '#FFBF00', padding: '8px 16px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', flexShrink: 0 }}
                            >
                              Copy Tracked Link
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
            

            {/* ---------------------------------------------------------------- */}
            {/* TAB 3: LIVE SUPPORT DESK (PREMIUM GEOFENCED HUBS)                 */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'Live Support Desk' && (
              <div style={{ 
                backgroundColor: "#022329", 
                borderRadius: "20px", 
                border: "1px solid #1e293b", 
                padding: "24px", 
                fontFamily: "sans-serif",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #1e293b", paddingBottom: "16px" }}>
                  <div>
                    <h3 style={{ margin: 0, color: "#ffffff", fontSize: "14px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px" }}>
                      Regional Operational Hub
                    </h3>
                    <p style={{ margin: "6px 0 0 0", fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>
                      Streaming geofenced transactions for Country Code: <b style={{ color: "#FFBF00", fontFamily: "monospace" }}>{partnerData?.countryCode || "US"}</b>
                    </p>
                  </div>
                  <span style={{ fontSize: "10px", backgroundColor: "rgba(255, 191, 0, 0.1)", color: "#FFBF00", border: "1px solid #FFBF00", padding: "4px 12px", borderRadius: "20px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    🔒 Multi-Tenant Isolation Active
                  </span>
                </div>

{loadingTickets ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px" }}>
                    Decrypting regional matrix streams...
                  </div>
                ) : activeTickets.filter(t => t.status === "open").length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", border: "2px dashed #1e293b", borderRadius: "12px", color: "#64748b", fontSize: "12px" }}>
                    📭 No active leads or support tickets broadcasted to this territory today.
                  </div>
                ) : (
                 <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {activeTickets
                      .filter(ticket => ticket.status === "open")
                      .map((ticket) => {
                        return (
                          <div 
                            key={ticket.id} 
                            onClick={() => {
                              if (typeof setActiveChatRoom === "function") {
                                console.log("🔍 AGENT CLICKED TICKET OBJECT DATA:", ticket);

                                let targetRoomId = "";
                                if (ticket.ticketId && String(ticket.ticketId).startsWith("tkt_gen_")) {
                                  targetRoomId = ticket.ticketId;
                                } else if (ticket.inquiryId && String(ticket.inquiryId).startsWith("tkt_gen_")) {
                                  targetRoomId = ticket.inquiryId;
                                } else if (ticket.id && String(ticket.id).startsWith("tkt_gen_")) {
                                  targetRoomId = ticket.id;
                                } else {
                                  targetRoomId = ticket.ticketId || ticket.id || "";
                                }

                                console.log(`🔌 Agent terminal routing to Room: ${targetRoomId}`);
                                setActiveChatRoom(targetRoomId);

                                // 🎯 THE ANCHOR: Lock the clean code string into the window context 
                                // so background snapshot re-renders cannot change it out from under you!
                                if (typeof window !== "undefined") {
                                  (window as any).__bazaria_hard_room_id = targetRoomId;
                                }
                              }
                            }} // ⚡ Closes the onClick event handler completely and cleanly
                           
                            style={{ 
                              padding: "20px", 
                              borderRadius: "14px", 
                              border: activeTicketData?.id === ticket.id ? "2px solid #00fcd2" : "1px solid #1e293b", 
                              backgroundColor: "#05292e", 
                              display: "flex",
                              flexDirection: "row",
                              flexWrap: "wrap", 
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "16px",
                              cursor: "pointer", 
                              transition: "all 0.15s ease-in-out"
                            }}
                          >
                            {/* 🛠️ Your exact UI card rendering layer continues completely untouched below: */}
                            <div style={{ flex: "1 1 280px" }}> 
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                <span style={{ fontSize: "9px", fontWeight: 900, backgroundColor: ticket.type === "sales" ? "#0d9488" : "#991b1b", color: "#ffffff", padding: "3px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                  {ticket.type}
                                </span>
                                <span style={{ fontSize: "11px", fontFamily: "monospace", fontWeight: "bold", color: "#94a3b8" }}>
                                  {ticket.ticketId}
                                </span>
                              </div>
                              <p style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: 700, color: "#ffffff", lineHeight: "1.4" }}>
                                {ticket.lastMessage}
                              </p>
                              <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>
                                Source Agent: <b style={{ color: "#ffffff" }}>{ticket.agentName}</b> ({ticket.countryCode})
                              </span>
                            </div>

                         {/* 🔍 CLEANLY PACKAGED TRANSACTION BUTTON */}
                <button 
                  type="button" 
                  onClick={async (e) => {
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    
                    if (!user?.uid) {
                      alert("🔒 Authentication timeout. Please log back in to claim active leads.");
                      return;
                    }

                    const rawSubject = ticket.subject || "";
                    const derivedDesc = rawSubject.includes('[Ref:')
                      ? rawSubject.split('[Ref:')[0].trim()
                      : ticket.lastMessage || ticket.message || "";

                    const match = rawSubject.match(/XID-[A-Z0-9]{5}/i);
                    const derivedXid = match 
                      ? match[0].toUpperCase() 
                      : ticket.product_code 
                        ? `XID-${ticket.product_code.toUpperCase().replace("XID-", "")}` 
                        : "";

                    // 1️⃣ Force update local storage parameters BEFORE executing the wire transfer.
                    // This lets the client window immediately discover the tracking change.
                    if (typeof window !== "undefined") {
                      localStorage.setItem("bazaria_active_ticket", ticket.id);
                    }

                    const { doc, updateDoc } = await import("firebase/firestore");
                    const ticketRef = doc(db, "support_tickets", ticket.id);

                    try {
                      console.log("⚡ Initiating direct status claim update for ID:", ticket.id);

                      // 2️⃣ Pure state update: Simply switch the ticket status to "claimed".
                      // Your unified onSnapshot listener inside the drawer will automatically
                      // detect this status switch, lock the survey closed, and inject the 
                      // system claim message bubble on the client side natively!
                      await updateDoc(ticketRef, {
                        status: "claimed",
                        claimedByUid: user.uid,
                        claimedByAgentName: partnerData?.name || "Bo Dango",
                        claimedAt: new Date().toISOString()
                      });

                      // 3️⃣ Synchronize local workspace variables
                      setSyncDescription(derivedDesc);
                      setSyncXid(derivedXid);

                      if (typeof setActiveChatRoom === "function") {
                        setActiveChatRoom(ticket.id);
                      }
                      
                      console.log("✅ Lead status successfully updated to claimed!");

                    } catch (error) {
                      console.error("❌ Direct pipeline write failed:", error);
                      alert("⚠️ Broadcast pipeline sync dropped.");
                    }
                  }}
                  style={{ padding: "8px 16px", backgroundColor: "#FFBF00", color: "#05292e", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "900", cursor: "pointer" }}
                >
                  Claim Broadcast Lead ⚡
                </button>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* TAB 4: CREDENTIALS & VAULT                                       */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'Credentials & Vault' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                
                {/* 💳 BAZARIA DEBIT CARD CONTAINER */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '380px',
                  height: '220px',
                  background: 'linear-gradient(135deg, #0d9488 0%, #05292e 50%, #022c22 100%)',
                  borderRadius: '24px',
                  padding: '24px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
                  border: '1px solid rgba(20, 184, 166, 0.4)',
                  overflow: 'hidden',
                  margin: '0 auto',
                  fontFamily: 'sans-serif'
                }}>
                  <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '260px', height: '260px', background: 'radial-gradient(circle, rgba(45, 212, 191, 0.2) 0%, transparent 75%)', pointerEvents: 'none' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 1000, color: '#ffffff', letterSpacing: '0.2em', textTransform: 'uppercase' }}>BAZARIA</h3>
                      <span style={{ fontSize: '7px', fontWeight: 900, color: '#FFBF00', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px', display: 'block' }}>Sovereign Node</span>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5"><path d="M5 12h.01M8.5 8.5a5 5 0 0 1 0 7M12 5a10 10 0 0 1 0 14"/></svg>
                  </div>

                  <div style={{ width: '38px', height: '28px', background: 'linear-gradient(135deg, #FFBF00 0%, #d97706 100%)', borderRadius: '6px', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.15)', position: 'relative', zIndex: 2, marginTop: '10px' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 2 }}>
                    <div>
                      <code style={{ fontSize: '14px', color: '#e2e8f0', letterSpacing: '3px', fontWeight: 700, display: 'block', fontFamily: 'monospace' }}>••••  ••••  ••••  {agentFields?.phone ? agentFields.phone.substring(agentFields.phone.length - 4) : '7742'}</code>
                      <span style={{ fontSize: '10px', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', marginTop: '12px', display: 'block', letterSpacing: '1px' }}>
                        {(partnerData?.name || "BO DANGO").split(' ')[0].toUpperCase()}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', fontWeight: 1000, color: '#FFBF00', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Vault</span>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#0b1329', border: '1px solid #1e293b', borderRadius: '20px', padding: '20px', color: '#fff' }}>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 900 }}>Onboarding Compliance Check</h4>
                  <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>Verify your institutional license parameters to maintain active payout thresholds.</p>
                </div>
              </div>
            )}

          </div> {/* Right Column Close */}
        </div> {/* Grid Container Close */}

        {/* 📚 LISTING AGENT HANDBOOK */}
        <div style={{ marginTop: '32px' }}>
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '14px', margin: 0 }}>
                  📚 Listing Agent Handbook
                </h3>
                <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>
                  Operational protocols, system tools, and expansion strategies for Bazaria Stewards.
                </p>
              </div>
              <span style={{ backgroundColor: '#f0fdf4', color: '#166534', ...s.badge }}>Protocols Active</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
              
              {/* MODULE 1: ONBOARDING */}
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '900', color: '#05292e' }}>
                  1. Corporate Onboarding
                </h4>
                <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4', margin: '0 0 16px 0' }}>
                  Execute the official Partner Intake protocol to register new corporate inventory.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button 
                    onClick={() => router.push('/register/partner')}
                    style={{ width: '100%', backgroundColor: '#05292e', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', color: '#ffffff', cursor: 'pointer' }}
                  >
                    Launch Onboarding Form
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      const origin = typeof window !== "undefined" ? window.location.origin : "https://bazaria.world";
                      const agentCode = user?.uid ? user.uid.substring(0, 8).toUpperCase() : "SYSTEM";
                      const clientLink = `${origin}/register/partner?agent=${agentCode}`;
                      
                      navigator.clipboard.writeText(clientLink);
                      alert(`🎯 Trackable Invite Link Copied to Clipboard!\n\n${clientLink}\n\nWhen a client uses this link, registration metrics automatically route straight to your account.`);
                    }}
                    style={{ 
                      width: '100%', 
                      backgroundColor: 'transparent', 
                      border: '1px solid #05292e', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      fontSize: '11px', 
                      fontWeight: '900', 
                      color: '#05292e', 
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(5, 41, 46, 0.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    Copy Client Invite Link
                  </button>
                </div>
              </div>

              {/* MODULE 2: SYSTEM PROTOCOLS */}
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '900', color: '#05292e' }}>
                  2. Operational Handbook
                </h4>
                <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4', margin: '0 0 16px 0' }}>
                  Access technical manuals for listing mechanics, support, and expansion.
                </p>
                <button 
                  onClick={() => router.push('/handbook')}
                  style={{ width: '100%', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', color: '#05292e', cursor: 'pointer' }}
                >
                  Open Handbook
                </button>
              </div>

              {/* MODULE 3: REFERRAL HUB */}
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '900', color: '#05292e' }}>
                  3. Expansion & Referrals
                </h4>
                
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', display: 'block', fontWeight: 900 }}>Referral Code</span>
                    <code style={{ fontSize: '12px', color: '#05292e', fontWeight: 900 }}>
                      BZ-AGENT-{user?.uid?.substring(0, 4).toUpperCase() || '7742'}
                    </code>
                  </div>
                  <button 
                    onClick={() => {
                      const code = `BZ-AGENT-${user?.uid?.substring(0, 4).toUpperCase() || '7742'}`;
                      navigator.clipboard.writeText(code);
                      alert('Code Copied!');
                    }}
                    style={{ backgroundColor: 'transparent', border: '1px solid #05292e', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 900, cursor: 'pointer' }}
                  >
                    Copy
                  </button>
                </div>

                <button 
                  onClick={() => router.push('/handbook/network')}
                  style={{ width: '100%', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', color: '#05292e', cursor: 'pointer' }}
                >
                  Network Strategy
                </button>
              </div>

            </div>
          </div>
        </div>

      </div> {/* Main Layout Inner Page Wrapper Close */}

{/* 🚀 BRAND NEW ISOLATED AGENT DRAWER */}
      {activeChatRoom && (
        <AgentSupportDrawer 
          roomId={activeChatRoom} 
          agentUser={user} 
          onClose={() => {
            // 🛡️ Guard execution flow: Only clean states if the window/drawer close action is manual
            const isDrawerStillIntact = document.querySelector('[data-drawer-active="true"]');
            
            console.log("🛑 CLEAN UNMOUNT: Ejecting drawer component securely.");
            localStorage.removeItem("bazaria_active_ticket");
            sessionStorage.removeItem("force_open_support_triage");
            setActiveChatRoom(null);
            if (typeof setTicketStatus === "function") {
              setTicketStatus("idle");
            }
          }} 
        />
      )}

      {/* 📡 MOBILE LOCK SCREEN PUSH DISPATCH REGISTER */}
      <div style={{ padding: '0 24px 48px 24px', display: 'flex', justifyContent: 'center', width: '100%' }}>
        <AgentNotificationRegister />
      </div>

    {/* 🛑 ADD THIS EXTRA CLOSING ELEMENT IF YOUR MAIN DASHBOARD BODY VANISHED */}
    </div> 
  );
}

// Styles Object Declarations
const dashboardStyles = {
  card: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
  },
};

export { dashboardStyles as s };
