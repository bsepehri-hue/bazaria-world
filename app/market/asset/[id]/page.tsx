"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase/client";
import { 
  doc, getDoc, updateDoc, increment, collection, addDoc, 
  serverTimestamp, query, where, getDocs 
} from "firebase/firestore";
import { 
  MapPin, ArrowLeft, Share2, Heart, ShieldCheck, UserCircle, 
  Clock, Gavel, ShoppingCart, ThumbsUp, Minus, ThumbsDown, Zap,
  MessageSquare 
} from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider"; 


export default function AssetDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState("SYNCING...");
  const [isVoting, setIsVoting] = useState(false);
  const { user } = useAuth(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("Hello, I am interested in this item. Is it still available?");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function fetchAsset() {
      if (!id) return;
      try {
        const docRef = doc(db, "listings", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as any;
          setAsset(data);
          setActiveImage(data.imageUrl || data.image || data.images?.[0] || null);
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    }
    fetchAsset();
  }, [id]);

  // 💬 NEW SECURE MESSAGING TRIGGER (Opens the Modal first)
  const handleContactMerchant = () => {
    if (!user) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    // 🚨 Safety Check: Make sure the asset has actually loaded first!
    if (!asset) {
      alert("Loading asset details, please wait a moment...");
      return;
    }

    // Grab the ID from whatever field it's stored in
    const merchantId = asset.merchantId || asset.userId || asset.sellerId;

    if (!merchantId) {
      console.log("Debug - Current Asset Object:", asset); // This will print the whole object in your browser console so we can see what fields are on it!
      alert("Merchant ID not found in protocol.");
      return;
    }

    if (user.uid === merchantId) {
      alert("This is your own listing.");
      return;
    }

    // Open the gorgeous modal!
    setIsModalOpen(true);
  };

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSending) return;

    const merchantId = asset.merchantId || asset.userId || asset.sellerId;
    const cleanMessage = messageText.trim();

    if (!cleanMessage) return;

    setIsSending(true);

    try {
      const chatsRef = collection(db, "chats");
      
      // Query to see if a conversation thread already exists for this asset and buyer
      const q = query(
        chatsRef,
        where("listingId", "==", id),
        where("participants", "array-contains", user.uid)
      );

      const querySnapshot = await getDocs(q);
      let chatId;

      if (!querySnapshot.empty) {
        chatId = querySnapshot.docs[0].id;

        // Thread exists: just write the message inside the subcollection
        const messagesRef = collection(db, "chats", chatId, "messages");
        await addDoc(messagesRef, {
          senderId: user.uid,
          text: cleanMessage,
          timestamp: serverTimestamp()
        });

        // Update last message in the main thread
        await updateDoc(doc(db, "chats", chatId), {
          lastMessage: cleanMessage,
          lastMessageTimestamp: serverTimestamp(),
          unreadBy: [merchantId] // Flag unread for the merchant
        });

      } else {
        // No thread exists: create a brand new master conversation thread
        const newChat = await addDoc(chatsRef, {
          listingId: id,
          listingTitle: asset.title || "Premium Asset",
          listingImage: activeImage || "",
          buyerId: user.uid,
          sellerId: merchantId,
          participants: [user.uid, merchantId],
          lastMessage: cleanMessage,
          lastMessageTimestamp: serverTimestamp(),
          unreadBy: [merchantId]
        });

        chatId = newChat.id;

        // Write the initial text inside the new thread's messages subcollection
        await addDoc(collection(db, "chats", chatId, "messages"), {
          senderId: user.uid,
          text: cleanMessage,
          timestamp: serverTimestamp()
        });
      }

      // Close modal and route to the new, stunning inbox page
      setIsModalOpen(false);
      router.push("/market/inbox");

    } catch (err) {
      console.error("Failed to send secure message:", err);
      alert("Failed to initiate secure chat.");
    } finally {
      setIsSending(false);
    }
  };

  // 💳 SECURE BUY / TRANSACTION HANDLER
  const handleBuyClick = () => {
    if (!user) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Authenticated flow: route directly to checkout
    router.push("/market/checkout");
  };

  // 🔨 SECURE PLACE BID HANDLER
  const handlePlaceBidClick = () => {
    if (!user) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Authenticated flow: Trigger your bidding action
    alert("Bidding logic active!");
  };

  // 🗳️ SECURE MERCHANT PULSE VOTE HANDLER
  const handlePulseVote = async (type: 'positive' | 'neutral' | 'negative') => {
    if (!user) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    if (!asset?.merchantId) return;
    setIsVoting(true);
    try {
      await addDoc(collection(db, "reviews"), {
        merchantId: asset.merchantId,
        voterId: user.uid, 
        type: type,
        assetId: id,
        createdAt: serverTimestamp()
      });
      const merchantRef = doc(db, "users", asset.merchantId);
      const field = type === 'positive' ? 'pulsePositive' : type === 'neutral' ? 'pulseNeutral' : 'pulseNegative';
      await updateDoc(merchantRef, { [field]: increment(1) });
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { pulsePoints: increment(25) });
      alert("Pulse Recorded. +25 Points Awarded.");
    } catch (err) { console.error(err); }
    setIsVoting(false);
  };

  useEffect(() => {
    if (!asset) return;
    const interval = setInterval(() => {
      const targetTime = asset.endTime || asset.endsAt;
      if (!targetTime) {
        setTimeLeft("24h left");
        return;
      }
      const difference = new Date(targetTime).getTime() - Date.now();
      if (difference <= 0) {
        setTimeLeft("EXPIRED");
        clearInterval(interval);
        return;
      }
      const totalHours = Math.floor(difference / (1000 * 60 * 60));
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      setTimeLeft(days > 0 ? `${days}D : ${hours}H : ${minutes}M` : `${hours}H : ${minutes}M`);
    }, 1000);
    return () => clearInterval(interval);
  }, [asset]);

  if (loading) return <div className="h-screen flex items-center justify-center font-black uppercase text-slate-300">Synchronizing...</div>;
  if (!asset) return <div className="h-screen flex items-center justify-center font-black uppercase text-slate-400">Offline</div>;

  const isAuction = asset.saleMode?.includes("Auction");
  const currentBid = Number(asset.currentBid) || Number(asset.startingBid) || 0;
  const buyNowPrice = Number(asset.buyNowPrice) || Number(asset.price) || 0;
  const allImages = [asset.imageUrl, ...(asset.imageUrls || []), ...(asset.images || [])].filter((url, idx, self) => url && self.indexOf(url) === idx);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] pb-20 font-sans overflow-x-hidden text-left">
      <nav className="max-w-[1400px] mx-auto p-10 px-6">
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <ArrowLeft size={20} style={{ color: '#94a3b8' }} />
          <span style={{ color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '13px' }}>Back to Market</span>
        </button>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 flex flex-col min-w-0">
          <div style={{ position: 'relative', width: '100%', backgroundColor: '#fff', borderRadius: '40px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)' }}>
            <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 60 }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}><Share2 size={20} /></div>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}><Heart size={20} className="text-red-500 fill-red-500" /></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', minHeight: '450px', paddingTop: '40px' }}>
              {activeImage && <img src={activeImage} style={{ maxHeight: '550px', width: 'auto', maxWidth: '100%' }} alt="Asset" />}
            </div>
            <div style={{ padding: '24px', borderTop: '1px solid #f8fafc' }}>
              <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                {allImages.map((url, idx) => (
                  <button key={idx} onClick={() => setActiveImage(url)} style={{ width: '100px', height: '100px', minWidth: '100px', flexShrink: 0, backgroundColor: 'white', border: activeImage === url ? '4px solid #14b8a6' : '1px solid #f1f5f9', borderRadius: '16px', overflow: 'hidden', padding: 0 }}><img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '32px' }}>
            {asset.lotSize && (
              <div style={{ flex: '1 1 160px', backgroundColor: '#fff', padding: '24px', borderRadius: '32px', border: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Lot Area</p>
                <p style={{ fontSize: '18px', fontWeight: 900 }}>{asset.lotSize} <span className="text-slate-400 text-[11px] font-bold">Meters</span></p>
              </div>
            )}
            {(asset.beds || asset.bedrooms) && (
              <div style={{ flex: '1 1 160px', backgroundColor: '#fff', padding: '24px', borderRadius: '32px', border: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Config</p>
                <p style={{ fontSize: '18px', fontWeight: 900 }}>{asset.beds || asset.bedrooms} BD</p>
              </div>
            )}
            {asset.vin && (
              <div style={{ flex: '1 1 160px', backgroundColor: '#fff', padding: '24px', borderRadius: '32px', border: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>VIN Identification</p>
                <p style={{ fontSize: '16px', fontWeight: 900, fontFamily: 'monospace' }}>{asset.vin}</p>
              </div>
            )}
            {asset.mileage && (
              <div style={{ flex: '1 1 160px', backgroundColor: '#fff', padding: '24px', borderRadius: '32px', border: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Usage Reading</p>
                <p style={{ fontSize: '18px', fontWeight: 900 }}>
                  {Number(asset.mileage).toLocaleString()} <span className="text-slate-400 text-[11px] font-bold">{asset.mileageUnit || "KM"}</span>
                </p>
              </div>
            )}
            <div style={{ flex: '1 1 160px', backgroundColor: '#fff', padding: '24px', borderRadius: '32px', border: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Condition</p>
              <p style={{ fontSize: '18px', fontWeight: 900, color: '#14b8a6' }}>{asset.condition || "Mint"}</p>
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <p className="text-2xl font-medium text-slate-600 italic">"{asset.description}"</p>
          </div>
        </div>

        <div className="lg:col-span-5 sticky top-10 flex flex-col gap-6">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col gap-8">
            <div className="flex flex-col gap-4 border-b border-slate-50 pb-6">
              <div style={{ backgroundColor: '#fbbf24', padding: '12px 20px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={18} className="text-white" strokeWidth={3} /><span className="text-[10px] font-900 text-white uppercase">Identity Verified</span></div>
                <span className="text-[11px] font-900 text-black">{asset.storeWebsite || 'bluemerchant@bazaria.site'}</span>
              </div>
              <h1 className="text-4xl font-900 uppercase tracking-tighter mt-2">{asset.title}</h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: '10px', borderRadius: '28px', border: '2px solid #f1f5f9' }}>
              <div className="flex items-center gap-3 pl-2">
                <div className="relative flex h-3 w-3"><span className="animate-ping absolute h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative h-3 w-3 bg-rose-500 rounded-full"></span></div>
                <span style={{ fontSize: '10px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{isAuction ? "Auction Pulse" : "Sovereign Active"}</span>
              </div>
              <div style={{ backgroundColor: '#f43f5e', padding: '12px 24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 8px 20px rgba(244, 63, 94, 0.3)' }}><Clock size={18} className="text-white animate-pulse" /><span style={{ fontSize: '14px', fontWeight: 1000, color: '#fff' }}>{timeLeft}</span></div>
            </div>

            <div className="grid grid-cols-2 gap-8 py-4">
              {isAuction && <div style={{ borderRight: '1px solid #f1f5f9' }}><p style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Bid</p><div style={{ fontSize: '32px', fontWeight: 950, color: '#14b8a6' }}>${currentBid.toLocaleString()}</div></div>}
              <div><p style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Price</p><div style={{ fontSize: '32px', fontWeight: 950, color: '#000' }}>${buyNowPrice.toLocaleString()}</div></div>
            </div>

            <div className="flex flex-col gap-4">
              {/* 1. PRIMARY: BID OR BUY NOW (DYNAMIC) */}
              <button 
                onClick={isAuction ? handlePlaceBidClick : handleBuyClick} 
                className="h-[68px] bg-[#14b8a6] text-white rounded-[40px] font-black uppercase transition-all hover:brightness-110 active:scale-95"
              >
                {isAuction ? "Place Bid" : "Buy Now"}
              </button>
              
              {/* 2. DIRECT ACTION: BUY IT NOW (BLACK) */}
              <button 
                onClick={handleBuyClick} 
                className="h-[68px] bg-black text-white rounded-[40px] font-black uppercase hover:opacity-90 transition-all active:scale-[0.98]"
              >
                Buy It Now
              </button>

              {/* 3. NEGOTIATION: MESSAGE MERCHANT (SLATE) */}
              <button 
                onClick={handleContactMerchant}
                className="h-[68px] bg-slate-100 text-[#0f172a] rounded-[40px] font-black uppercase flex items-center justify-center gap-3 hover:bg-slate-200 transition-all active:scale-[0.98]"
              >
                <MessageSquare size={20} />
                Message Merchant
              </button>

              {/* 4. NAVIGATION */}
              <button 
                onClick={() => router.push('/market')} 
                className="h-[56px] border-2 border-[#14b8a6] text-[#14b8a6] rounded-[40px] font-black uppercase text-[11px] hover:bg-teal-50 transition-all"
              >
                Client Dashboard Portal
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="max-w-[1400px] mx-auto px-6 mt-16 mb-20">
        <div style={{ backgroundColor: '#fff', borderRadius: '3.5rem', border: '1px solid #f1f5f9', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.03)', overflow: 'hidden' }} className="grid grid-cols-1 lg:grid-cols-2">
          <div style={{ padding: '64px', borderRight: '1px solid #f8fafc' }}>
            <p style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '32px' }}>Merchant Pulse Authority</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginBottom: '48px' }}>
              <span style={{ fontSize: '80px', fontWeight: 950, color: '#000', letterSpacing: '-0.05em', lineHeight: '1' }}>{asset.merchantPulseScore || "98"}%</span>
              <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '8px' }}>
                 <span style={{ fontSize: '14px', fontWeight: 900, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Positive Status</span>
                 <span style={{ fontSize: '10px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase' }}>Verified Protocol</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[ { label: 'Positive', count: asset.pulsePositive || '1,204', color: '#14b8a6', width: '98%', icon: <ThumbsUp size={14}/> }, { label: 'Neutral', count: asset.pulseNeutral || '18', color: '#fbbf24', width: '1.5%', icon: <Minus size={14}/> }, { label: 'Negative', count: asset.pulseNegative || '6', color: '#f43f5e', width: '0.5%', icon: <ThumbsDown size={14}/> } ].map((pulse, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: pulse.color }}>{pulse.icon} <span>{pulse.label}</span></div>
                    <span style={{ color: '#000' }}>{pulse.count}</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#f8fafc', borderRadius: '10px' }}><div style={{ width: pulse.width, height: '100%', backgroundColor: pulse.color, borderRadius: '10px' }}></div></div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '64px', backgroundColor: '#fafbfc' }} className="flex flex-col items-center justify-center text-center">
            <div style={{ width: '100%', maxWidth: '320px' }}>
              <div style={{ marginBottom: '40px' }}>
                <p style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '12px' }}>Participation Protocol</p>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#000', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Record Merchant Pulse</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => handlePulseVote('positive')} className="flex items-center justify-center gap-3 bg-white text-[#14b8a6] border border-[#14b8a6]/10 h-16 rounded-2xl font-900 uppercase text-[12px] tracking-widest transition-all hover:shadow-lg cursor-pointer"><ThumbsUp size={20} /> Positive</button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button onClick={() => handlePulseVote('neutral')} className="flex items-center justify-center gap-3 bg-white text-[#fbbf24] border border-[#fbbf24]/10 h-16 rounded-2xl font-900 uppercase text-[11px] tracking-widest transition-all hover:shadow-lg cursor-pointer"><Minus size={18} /> Neutral</button>
                  <button onClick={() => handlePulseVote('negative')} className="flex items-center justify-center gap-3 bg-white text-[#f43f5e] border border-[#f43f5e]/10 h-16 rounded-2xl font-900 uppercase text-[11px] tracking-widest transition-all hover:shadow-lg cursor-pointer"><ThumbsDown size={18} /> Negative</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 🛡️ HIGH-END INQUIRY MODAL */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(3, 29, 32, 0.85)", // Deep dark teal blur overlay
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            color: "#05292E",
            borderRadius: "32px",
            padding: "36px",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            border: "1px solid #FFBF00",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box"
          }}>
            
            {/* Modal Header */}
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontSize: "9px", fontWeight: 900, color: "#FFBF00", letterSpacing: "1px", textTransform: "uppercase" }}>
                Secure Communication Protocol
              </span>
              <h3 style={{ fontSize: "20px", fontWeight: 1000, margin: "4px 0 0 0", textTransform: "uppercase" }}>
                Inquire About Asset
              </h3>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "6px 0 0 0", fontWeight: 600 }}>
                Your message will instantly establish an encrypted communication thread with the seller.
              </p>
            </div>

            {/* Asset Preview Card */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#f8fafc",
              padding: "12px 16px",
              borderRadius: "16px",
              marginBottom: "24px",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "10px", backgroundColor: "#05292E",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden"
              }}>
                {activeImage ? (
                  <img src={activeImage} alt={asset?.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <MessageSquare size={18} color="#FFBF00" />
                )}
              </div>
              <div style={{ overflow: "hidden" }}>
                <h4 style={{ fontSize: "13px", fontWeight: 1000, margin: 0, color: "#05292E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {asset?.title}
                </h4>
                <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 700 }}>Listing ID: {id}</span>
              </div>
            </div>

            {/* Form Input area */}
            <form onSubmit={handleSendInquiry} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                required
                rows={5}
                placeholder="Type your inquiry message..."
                style={{
                  width: "100%",
                  backgroundColor: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "16px",
                  padding: "16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#05292E",
                  outline: "none",
                  resize: "none",
                  lineHeight: "1.5",
                  boxSizing: "border-box"
                }}
              />

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    backgroundColor: "#f1f5f9",
                    color: "#64748b",
                    border: "none",
                    borderRadius: "32px",
                    fontWeight: 800,
                    fontSize: "11px",
                    textTransform: "uppercase",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSending}
                  style={{
                    flex: 2,
                    padding: "14px",
                    backgroundColor: "#05292E",
                    color: "#FFBF00",
                    border: "1px solid #FFBF00",
                    borderRadius: "32px",
                    fontWeight: 1000,
                    fontSize: "11px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    opacity: isSending ? 0.6 : 1,
                    transition: "all 0.1s ease"
                  }}
                >
                  {isSending ? "ESTABLISHING THREAD..." : "SEND SECURE MESSAGE"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
