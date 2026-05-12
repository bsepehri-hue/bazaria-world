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

  const handleContactMerchant = () => {
    if (!user) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    if (!asset) {
      alert("Loading asset details, please wait a moment...");
      return;
    }
    const merchantId = asset.merchantId || asset.userId || asset.sellerId;
    if (!merchantId) {
      alert("Merchant ID not found in protocol.");
      return;
    }
    if (user.uid === merchantId) {
      alert("This is your own listing.");
      return;
    }
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
      const q = query(
        chatsRef,
        where("listingId", "==", id),
        where("participants", "array-contains", user.uid)
      );

      const querySnapshot = await getDocs(q);
      let chatId;

      if (!querySnapshot.empty) {
        chatId = querySnapshot.docs[0].id;
        const messagesRef = collection(db, "chats", chatId, "messages");
        await addDoc(messagesRef, {
          senderId: user.uid,
          text: cleanMessage,
          timestamp: serverTimestamp()
        });
        await updateDoc(doc(db, "chats", chatId), {
          lastMessage: cleanMessage,
          lastMessageTimestamp: serverTimestamp(),
          unreadBy: [merchantId]
        });
      } else {
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
        await addDoc(collection(db, "chats", chatId, "messages"), {
          senderId: user.uid,
          text: cleanMessage,
          timestamp: serverTimestamp()
        });
      }
      setIsModalOpen(false);
      router.push("/market/inbox");
    } catch (err) {
      console.error(err);
      alert("Failed to initiate secure chat.");
    } finally {
      setIsSending(false);
    }
  };

  const handleBuyClick = () => {
    if (!user) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    router.push("/market/checkout");
  };

  const handlePlaceBidClick = () => {
    if (!user) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    alert("Bidding logic active!");
  };

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
        setTimeLeft("24H LEFT");
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

  if (loading) return <div className="h-screen flex items-center justify-center font-black uppercase text-teal-600 bg-[#020617]">PROTOCOL SYNCING...</div>;
  if (!asset) return <div className="h-screen flex items-center justify-center font-black uppercase text-slate-400">Offline</div>;

  const isAuction = asset.saleMode?.includes("Auction");
  const currentBid = Number(asset.currentBid) || Number(asset.startingBid) || 0;
  const buyNowPrice = Number(asset.buyNowPrice) || Number(asset.price) || 0;
  const allImages = [asset.imageUrl, ...(asset.imageUrls || []), ...(asset.images || [])].filter((url, idx, self) => url && self.indexOf(url) === idx);

  return (
    <div className="min-h-screen bg-[#020617] text-[#f8fafc] pb-20 font-sans overflow-x-hidden text-left">
      
      {/* 👑 ELITE BLACK & GOLD IDENTITY BAR */}
      <nav className="w-full bg-[#030712] border-b border-[#FFBF00]/20 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto p-6 px-6 flex justify-between items-center">
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <ArrowLeft size={18} style={{ color: '#FFBF00' }} />
            <span style={{ color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '12px' }}>Back to Marketplace</span>
          </button>
          <div className="text-right">
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#FFBF00', letterSpacing: '2px', textTransform: 'uppercase' }}>BAZARIA PROTOCOL</span>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: HERO VISUALS & METRIC MATRIX CONTAINER */}
        <div className="lg:col-span-7 flex flex-col min-w-0">
          
          {/* Main Showcase Canvas */}
          <div style={{ position: 'relative', width: '100%', backgroundColor: '#030712', borderRadius: '32px', border: '1px solid #1e293b', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 40 }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(3, 7, 18, 0.8)', color: '#fff', display: 'flex', alignItems: 'center', justifyStyle: 'center', border: '1px solid #1e293b', cursor: 'pointer', justifyContent: 'center' }}><Share2 size={18} /></div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(3, 7, 18, 0.8)', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyStyle: 'center', border: '1px solid #1e293b', cursor: 'pointer', justifyContent: 'center' }}><Heart size={18} className="fill-rose-500" /></div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '480px', padding: '40px 20px' }}>
              {activeImage && <img src={activeImage} style={{ maxHeight: '500px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }} alt="Asset" />}
            </div>
            
            {/* Gallery Filmstrip Row */}
            <div style={{ padding: '20px', borderTop: '1px solid #1e293b', backgroundColor: 'rgba(2, 6, 23, 0.4)' }}>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                {allImages.map((url, idx) => (
                  <button key={idx} onClick={() => setActiveImage(url)} style={{ width: '85px', height: '85px', minWidth: '85px', flexShrink: 0, backgroundColor: '#020617', border: activeImage === url ? '3px solid #FFBF00' : '1px solid #1e293b', borderRadius: '14px', overflow: 'hidden', padding: 0, cursor: 'pointer' }}><img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></button>
                ))}
              </div>
            </div>
          </div>

          {/* 🧱 NESTED PARAMETER NESTING MATRIX CARD */}
          <div style={{ backgroundColor: '#030712', border: '1px solid #1e293b', borderRadius: '32px', padding: '24px', marginTop: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }}>
            <span style={{ fontSize: '9px', fontWeight: 900, color: '#FFBF00', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '16px' }}>Verified Asset Parameters</span>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
              {asset.lotSize && (
                <div style={{ backgroundColor: '#020617', padding: '20px', borderRadius: '20px', border: '1px solid #1e293b' }}>
                  <p style={{ fontSize: '8px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Lot Area</p>
                  <p style={{ fontSize: '16px', fontWeight: 900, color: '#f8fafc' }}>{asset.lotSize} <span className="text-teal-500 text-[10px] font-bold">Meters</span></p>
                </div>
              )}
              {(asset.beds || asset.bedrooms) && (
                <div style={{ backgroundColor: '#020617', padding: '20px', borderRadius: '20px', border: '1px solid #1e293b' }}>
                  <p style={{ fontSize: '8px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Configuration</p>
                  <p style={{ fontSize: '16px', fontWeight: 900, color: '#f8fafc' }}>{asset.beds || asset.bedrooms} BD</p>
                </div>
              )}
              {asset.vin && (
                <div style={{ backgroundColor: '#020617', padding: '20px', borderRadius: '20px', border: '1px solid #1e293b' }}>
                  <p style={{ fontSize: '8px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>VIN Identification</p>
                  <p style={{ fontSize: '13px', fontWeight: 900, fontFamily: 'monospace', color: '#f8fafc' }}>{asset.vin}</p>
                </div>
              )}
              {asset.mileage && (
                <div style={{ backgroundColor: '#020617', padding: '20px', borderRadius: '20px', border: '1px solid #1e293b' }}>
                  <p style={{ fontSize: '8px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Usage Reading</p>
                  <p style={{ fontSize: '16px', fontWeight: 900, color: '#f8fafc' }}>
                    {Number(asset.mileage).toLocaleString()} <span className="text-teal-500 text-[10px] font-bold">{asset.mileageUnit || "KM"}</span>
                  </p>
                </div>
              )}
              <div style={{ backgroundColor: '#020617', padding: '20px', borderRadius: '20px', border: '1px solid #1e293b' }}>
                <p style={{ fontSize: '8px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Condition Status</p>
                <p style={{ fontSize: '16px', fontWeight: 900, color: '#14b8a6' }}>{asset.condition || "Mint"}</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '28px', paddingLeft: '12px' }}>
            <p className="text-xl font-medium text-slate-400 italic leading-relaxed">"{asset.description}"</p>
          </div>
        </div>

        {/* RIGHT COLUMN: TRANSACTION CONTROL TERMINAL */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-6">
          <div className="bg-[#030712] p-8 rounded-[2rem] shadow-2xl border border-slate-800/80 flex flex-col gap-6">
            
            {/* Merchant Identification Block */}
            <div className="flex flex-col gap-3 border-b border-slate-800 pb-5">
              <div style={{ backgroundColor: '#020617', padding: '10px 16px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #FFBF00/30' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} className="text-[#FFBF00]" strokeWidth={2.5} />
                  <span style={{ fontSize: '9px', fontWeight: 900, color: '#FFBF00', letterSpacing: '0.5px' }} className="uppercase">Identity Verified</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', fontFamily: 'monospace' }}>{asset.storeWebsite || 'bluemerchant@bazaria.site'}</span>
              </div>
              <h1 className="text-3xl font-1000 uppercase tracking-tight mt-2 text-white">{asset.title}</h1>
            </div>

            {/* Price Tracker Segment */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#020617', padding: '10px 14px', borderRadius: '20px', border: '1px solid #1e293b' }}>
              <div className="flex items-center gap-3 pl-2">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative h-2 w-2 bg-rose-500 rounded-full"></span>
                </div>
                <span style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>{isAuction ? "Auction Active" : "Sovereign Asset"}</span>
              </div>
              <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.15)', border: '1px solid #f43f5e', padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={14} className="text-rose-500 animate-pulse" />
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#f43f5e', fontFamily: 'monospace' }}>{timeLeft}</span>
              </div>
            </div>

            {/* Capital Values */}
            <div className="grid grid-cols-2 gap-4 py-2 bg-[#020617] p-4 rounded-2xl border border-slate-800">
              {isAuction && (
                <div style={{ borderRight: '1px solid #1e293b' }}>
                  <p style={{ fontSize: '9px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Current Live Bid</p>
                  <div style={{ fontSize: '26px', fontWeight: 950, color: '#14b8a6', fontFamily: 'monospace' }}>${currentBid.toLocaleString()}</div>
                </div>
              )}
              <div className={isAuction ? "pl-2" : "col-span-2"}>
                <p style={{ fontSize: '9px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Asset Buy Price</p>
                <div style={{ fontSize: '26px', fontWeight: 950, color: '#FFBF00', fontFamily: 'monospace' }}>${buyNowPrice.toLocaleString()}</div>
              </div>
            </div>

            {/* Actions Stack */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={isAuction ? handlePlaceBidClick : handleBuyClick} 
                className="h-[60px] bg-[#14b8a6] text-white rounded-2xl font-black uppercase text-xs tracking-wider transition-all hover:brightness-110 active:scale-95 cursor-pointer border-none"
              >
                {isAuction ? "🔒 Place Secure Bid" : "⚡ Purchase Asset"}
              </button>
              
              <button 
                onClick={handleBuyClick} 
                className="h-[60px] bg-white text-black rounded-2xl font-black uppercase text-xs tracking-wider hover:bg-slate-100 transition-all active:scale-[0.98] cursor-pointer border-none"
              >
                Buy It Now
              </button>

              <button 
                onClick={handleContactMerchant}
                className="h-[60px] bg-[#020617] text-[#94a3b8] border border-slate-800 rounded-2xl font-black uppercase text-xs tracking-wider flex items-center justify-center gap-3 hover:bg-slate-900 transition-all active:scale-[0.98] cursor-pointer"
              >
                <MessageSquare size={16} className="text-[#0d9488]" />
                Message Merchant
              </button>

              <button 
                onClick={() => router.push('/market')} 
                className="h-[50px] border border-[#FFBF00]/40 text-[#FFBF00] bg-transparent rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#FFBF00]/5 transition-all cursor-pointer"
              >
                Client Dashboard Portal
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* LOWER SECTION: MERCHANT PULSE NETWORK LEDGER */}
      <div className="max-w-[1400px] mx-auto px-6 mt-12 mb-20">
        <div style={{ backgroundColor: '#030712', borderRadius: '2.5rem', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', overflow: 'hidden' }} className="grid grid-cols-1 lg:grid-cols-2">
          
          <div style={{ padding: '48px', borderRight: '1px solid #1e293b' }}>
            <p style={{ fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '24px' }}>Merchant Pulse Authority</p>
            
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', marginBottom: '36px' }}>
              <span style={{ fontSize: '72px', fontWeight: 950, color: '#ffffff', letterSpacing: '-0.05em', lineHeight: '1', fontFamily: 'monospace' }}>{asset.merchantPulseScore || "98"}%</span>
              <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '6px' }}>
                 <span style={{ fontSize: '13px', fontWeight: 900, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Positive Status</span>
                 <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Verified Protocol</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { label: 'Positive', count: asset.pulsePositive || '1,204', color: '#14b8a6', width: '98%', icon: <ThumbsUp size={12}/> },
                { label: 'Neutral', count: asset.pulseNeutral || '18', color: '#fbbf24', width: '1.5%', icon: <Minus size={12}/> },
                { label: 'Negative', count: asset.pulseNegative || '6', color: '#f43f5e', width: '0.5%', icon: <ThumbsDown size={12}/> }
              ].map((pulse, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyStyle: 'space-between', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: pulse.color }}>{pulse.icon} <span>{pulse.label}</span></div>
                    <span style={{ color: '#ffffff' }}>{pulse.count}</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', backgroundColor: '#020617', borderRadius: '10px' }}><div style={{ width: pulse.width, height: '100%', backgroundColor: pulse.color, borderRadius: '10px' }}></div></div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '48px', backgroundColor: 'rgba(2, 6, 23, 0.3)' }} className="flex flex-col items-center justify-center text-center">
            <div style={{ width: '100%', maxWidth: '320px' }}>
              <div style={{ marginBottom: '32px' }}>
                <p style={{ fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '12px' }}>Participation Protocol</p>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Record Merchant Pulse</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => handlePulseVote('positive')} className="flex items-center justify-center gap-3 bg-[#020617] text-[#14b8a6] border border-[#14b8a6]/20 h-14 rounded-xl font-900 uppercase text-[11px] tracking-widest transition-all hover:bg-slate-900 cursor-pointer"><ThumbsUp size={16} /> Positive</button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button onClick={() => handlePulseVote('neutral')} className="flex items-center justify-center gap-3 bg-[#020617] text-[#fbbf24] border border-[#fbbf24]/20 h-14 rounded-xl font-900 uppercase text-[10px] tracking-widest transition-all hover:bg-slate-900 cursor-pointer"><Minus size={14} /> Neutral</button>
                  <button onClick={() => handlePulseVote('negative')} className="flex items-center justify-center gap-3 bg-[#020617] text-[#f43f5e] border border-[#f43f5e]/20 h-14 rounded-xl font-900 uppercase text-[10px] tracking-widest transition-all hover:bg-slate-900 cursor-pointer"><ThumbsDown size={14} /> Negative</button>
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
          backgroundColor: "rgba(2, 6, 23, 0.85)", 
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div style={{
            backgroundColor: "#030712",
            color: "#f8fafc",
            borderRadius: "28px",
            padding: "36px",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
            border: "1px solid #FFBF00",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box"
          }}>
            
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontSize: "9px", fontWeight: 900, color: "#FFBF00", letterSpacing: '1px', textTransform: "uppercase", display: 'block' }}>
                Secure Communication Protocol
              </span>
              <h3 style={{ fontSize: "20px", fontWeight: 1000, margin: "6px 0 0 0", textTransform: "uppercase", color: '#fff' }}>
                Inquire About Asset
              </h3>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "6px 0 0 0", fontWeight: 600, lineHeight: '1.4' }}>
                Your message will instantly establish an encrypted communication thread with the seller.
              </p>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#020617",
              padding: "12px 16px",
              borderRadius: "16px",
              marginBottom: "24px",
              border: "1px solid #1e293b"
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "10px", backgroundColor: "#030712",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", border: '1px solid #1e293b'
              }}>
                {activeImage ? (
                  <img src={activeImage} alt={asset?.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <MessageSquare size={18} color="#FFBF00" />
                )}
              </div>
              <div style={{ overflow: "hidden", textTranslate: 'none' }}>
                <h4 style={{ fontSize: "13px", fontWeight: 1000, margin: 0, color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {asset?.title}
                </h4>
                <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 700, fontFamily: 'monospace' }}>ID: {id}</span>
              </div>
            </div>

            <form onSubmit={handleSendInquiry} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                required
                rows={4}
                style={{
                  width: "100%",
                  backgroundColor: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: "16px",
                  padding: "16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#ffffff",
                  outline: "none",
                  resize: "none",
                  lineHeight: "1.5",
                  boxSizing: "border-box"
                }}
              />

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    backgroundColor: "#1e293b",
                    color: "#cbd5e1",
                    border: "none",
                    borderRadius: "16px",
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
                    backgroundColor: "#020617",
                    color: "#FFBF00",
                    border: "1px solid #FFBF00",
                    borderRadius: "16px",
                    fontWeight: 1000,
                    fontSize: "11px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    opacity: isSending ? 0.6 : 1
                  }}
                >
                  {isSending ? "SECURE SYNCING..." : "SEND SECURE MESSAGE"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
