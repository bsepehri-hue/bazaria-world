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
    if (!asset) return;
    const merchantId = asset.merchantId || asset.userId || asset.sellerId;
    if (!merchantId) return;
    if (user.uid === merchantId) return;
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

  const handlePulseVote = async (type: 'positive' | 'neutral' | 'negative') => {
    if (!user || !asset?.merchantId) return;
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
      setIsVoting(false);
    } catch (err) { console.error(err); }
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

  if (loading) return <div className="h-screen flex items-center justify-center font-black uppercase text-teal-600 bg-[#f8fafc]">PROTOCOL SYNCING...</div>;
  if (!asset) return <div className="h-screen flex items-center justify-center font-black uppercase text-slate-400">Offline</div>;

  const isAuction = asset.saleMode?.includes("Auction");
  const currentBid = Number(asset.currentBid) || Number(asset.startingBid) || 0;
  const buyNowPrice = Number(asset.buyNowPrice) || Number(asset.price) || 0;
  const allImages = [asset.imageUrl, ...(asset.imageUrls || []), ...(asset.images || [])].filter((url, idx, self) => url && self.indexOf(url) === idx);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] pb-20 font-sans overflow-x-hidden text-left">
      
      {/* 🖨️ EMBEDDED REAL-TIME PRINT MEDIA STYLE OVERRIDES */}
      <style jsx global>{`
        @media print {
          /* Expand the full dashboard layout canvas down down infinitely to grab everything */
          html, body, .min-h-screen, main {
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            background-color: #ffffff !important;
            color: #000000 !important;
            position: static !important;
          }
          /* Ground top navbar layers flat */
          nav {
            position: relative !important;
            background-color: #000000 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          /* Strip away actions/back-links that make a document look unpolished */
          nav button, .absolute, button, .filmstrip-container, .no-print {
            display: none !important;
          }
          /* Transform side columns to drop cleanly inside raw full-screen layout order */
          main {
            display: flex !important;
            flex-direction: column !important;
            gap: 30px !important;
            max-width: 100% !important;
            padding: 0 !important;
          }
          /* Ensure luxury image gallery asset breaks naturally across physical sheets */
          .showcase-canvas {
            box-shadow: none !important;
            border: none !important;
            page-break-after: always !important;
            break-after: always !important;
          }
          .showcase-canvas img {
            max-height: 400px !important;
            margin: 0 auto !important;
          }
          /* Keep stats ledger cards structurally visible */
          .matrix-container {
            border: 1px solid #cbd5e1 !important;
            background: #ffffff !important;
          }
        }
      `}</style>

      {/* 👑 PREMIUM BLACK & GOLD IDENTITY NAVIGATION BAR */}
      <nav className="w-full bg-[#030712] border-b border-[#FFBF00]/30 sticky top-0 z-50 shadow-md">
        <div className="max-w-[1400px] mx-auto p-5 px-6 flex justify-between items-center">
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <ArrowLeft size={18} style={{ color: '#FFBF00' }} />
            <span style={{ color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '12px' }}>Back to Marketplace</span>
          </button>
          <div className="text-right">
            <span style={{ fontSize: '10px', fontWeight: 1000, color: '#FFBF00', letterSpacing: '2px', textTransform: 'uppercase' }}>BAZARIA LUXURY PORTAL</span>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: CRISP CANVAS SHOWCASE */}
        <div className="lg:col-span-7 flex flex-col min-w-0">
          
          {/* Main Pure White Showcase Canvas */}
          <div className="showcase-canvas" style={{ position: 'relative', width: '100%', backgroundColor: '#ffffff', borderRadius: '32px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
            <div className="absolute" style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 40 }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#0f172a', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', cursor: 'pointer', justifyContent: 'center' }}><Share2 size={18} /></div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#f43f5e', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', cursor: 'pointer', justifyContent: 'center' }}><Heart size={18} className="fill-rose-500 text-rose-500" /></div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '480px', padding: '40px 20px', backgroundColor: '#ffffff' }}>
              {activeImage && <img src={activeImage} style={{ maxHeight: '500px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }} alt="Asset" />}
            </div>
            
            {/* Gallery Filmstrip Row */}
            <div className="filmstrip-container" style={{ padding: '20px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                {allImages.map((url, idx) => (
                  <button key={idx} onClick={() => setActiveImage(url)} style={{ width: '85px', height: '85px', minWidth: '85px', flexShrink: 0, backgroundColor: '#ffffff', border: activeImage === url ? '3px solid #05292e' : '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', padding: 0, cursor: 'pointer' }}><img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></button>
                ))}
              </div>
            </div>
          </div>

          {/* 🧱 NESTED MATRIX CARD CONTAINER */}
          <div className="matrix-container" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '32px', padding: '24px', marginTop: '24px', boxShadow: '0 15px 30px -10px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '16px' }}>Verified Asset Specifications</span>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
              {asset.lotSize && (
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Lot Area</p>
                  <p style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>{asset.lotSize} <span className="text-[#0d9488] text-[10px] font-bold">Meters</span></p>
                </div>
              )}
              {(asset.beds || asset.bedrooms) && (
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Configuration</p>
                  <p style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>{asset.beds || asset.bedrooms} BD</p>
                </div>
              )}
              {asset.vin && (
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>VIN Identification</p>
                  <p style={{ fontSize: '13px', fontWeight: 900, fontFamily: 'monospace', color: '#0f172a' }}>{asset.vin}</p>
                </div>
              )}
              {asset.mileage && (
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Usage Reading</p>
                  <p style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                    {Number(asset.mileage).toLocaleString()} <span className="text-[#0d9488] text-[10px] font-bold">{asset.mileageUnit || "KM"}</span>
                  </p>
                </div>
              )}
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Condition Status</p>
                <p style={{ fontSize: '16px', fontWeight: 900, color: '#0d9488' }}>{asset.condition || "Mint"}</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '28px', paddingLeft: '4px' }}>
            <p className="text-xl font-medium text-slate-500 italic leading-relaxed">"{asset.description}"</p>
          </div>
        </div>

        {/* RIGHT COLUMN: PREMIUM TRANSACTION MANAGEMENT CARD */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-200/60 flex flex-col gap-6">
            
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-5">
              <div style={{ backgroundColor: '#030712', padding: '10px 16px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #FFBF00' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} className="text-[#FFBF00]" strokeWidth={2.5} />
                  <span style={{ fontSize: '9px', fontWeight: 1000, color: '#FFBF00', letterSpacing: '0.5px' }} className="uppercase">Identity Verified</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', fontFamily: 'monospace' }}>{asset.storeWebsite || 'bluemerchant@bazaria.site'}</span>
              </div>
              <h1 className="text-3xl font-1000 uppercase tracking-tight mt-2 text-slate-900">{asset.title}</h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <div className="flex items-center gap-3 pl-2">
                <div className="no-print relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative h-2 w-2 bg-rose-500 rounded-full"></span></div>
                <span style={{ fontSize: '9px', fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>{isAuction ? "Auction Active" : "Sovereign Asset"}</span>
              </div>
              <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.08)', border: '1px solid #f43f5e', padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={14} className="text-rose-500" />
                <span style={{ fontSize: '12px', fontWeight: 1000, color: '#f43f5e', fontFamily: 'monospace' }}>{timeLeft}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 bg-[#f8fafc] p-4 rounded-2xl border border-slate-200">
              {isAuction && (
                <div style={{ borderRight: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '9px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Current Live Bid</p>
                  <div style={{ fontSize: '26px', fontWeight: 950, color: '#0d9488', fontFamily: 'monospace' }}>${currentBid.toLocaleString()}</div>
                </div>
              )}
              <div className={isAuction ? "pl-2" : "col-span-2"}>
                <p style={{ fontSize: '9px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Asset Purchase Price</p>
                <div style={{ fontSize: '26px', fontWeight: 950, color: '#0f172a', fontFamily: 'monospace' }}>${buyNowPrice.toLocaleString()}</div>
              </div>
            </div>

           <div className="no-print flex flex-col gap-3">
              <button 
                onClick={isAuction ? handlePlaceBidClick : handleBuyClick} 
                style={{ 
                  background: 'linear-gradient(135deg, #0d9488 0%, #05292e 100%)', 
                  border: 'none',
                  cursor: 'pointer'
                }} 
                className="h-[60px] text-white rounded-2xl font-black uppercase text-xs tracking-wider shadow-md"
              >
                {isAuction ? "🔒 Place Secure Bid" : "⚡ Purchase Asset"}
              </button>
              
              <button 
                onClick={handleBuyClick} 
                style={{ 
                  backgroundColor: '#030712', 
                  border: '1px solid #FFBF00',
                  cursor: 'pointer'
                }} 
                className="h-[60px] text-[#FFBF00] rounded-2xl font-black uppercase text-xs tracking-widest shadow-sm"
              >
                Buy It Now
              </button>

              <button 
                onClick={handleContactMerchant} 
                style={{ cursor: 'pointer' }}
                className="h-[60px] bg-slate-50 text-[#334155] border border-slate-200 rounded-2xl font-black uppercase text-xs tracking-wider flex items-center justify-center gap-3"
              >
                <MessageSquare size={16} className="text-[#0d9488]" /> 
                Message Merchant
              </button>
            </div>

      {/* LOWER SECTION: TRUST AUTHORITY CARD PROFILE */}
      <div className="max-w-[1400px] mx-auto px-6 mt-12 mb-20">
        <div style={{ backgroundColor: '#ffffff', borderRadius: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.02)', overflow: 'hidden' }} className="grid grid-cols-1 lg:grid-cols-2">
          
          <div style={{ padding: '48px', borderRight: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '24px' }}>Merchant Pulse Authority</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', marginBottom: '36px' }}>
              <span style={{ fontSize: '72px', fontWeight: 950, color: '#0f172a', letterSpacing: '-0.05em', lineHeight: '1', fontFamily: 'monospace' }}>{asset.merchantPulseScore || "98"}%</span>
              <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '6px' }}>
                 <span style={{ fontSize: '13px', fontWeight: 900, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Positive Status</span>
                 <span style={{ fontSize: '9px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase' }}>Verified Protocol</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { label: 'Positive', count: asset.pulsePositive || '1,204', color: '#0d9488', width: '98%', icon: <ThumbsUp size={12}/> },
                { label: 'Neutral', count: asset.pulseNeutral || '18', color: '#fbbf24', width: '1.5%', icon: <Minus size={12}/> },
                { label: 'Negative', count: asset.pulseNegative || '6', color: '#f43f5e', width: '0.5%', icon: <ThumbsDown size={12}/> }
              ].map((pulse, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyStyle: 'space-between', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: pulse.color }}>{pulse.icon} <span>{pulse.label}</span></div>
                    <span style={{ color: '#0f172a' }}>{pulse.count}</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', backgroundColor: '#f1f5f9', borderRadius: '10px' }}><div style={{ width: pulse.width, height: '100%', backgroundColor: pulse.color, borderRadius: '10px' }}></div></div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '48px', backgroundColor: '#f8fafc' }} className="no-print flex flex-col items-center justify-center text-center">
            <div style={{ width: '100%', maxWidth: '320px' }}>
              <div style={{ marginBottom: '32px' }}>
                <p style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '12px' }}>Participation Protocol</p>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Record Merchant Pulse</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => handlePulseVote('positive')} className="flex items-center justify-center gap-3 bg-white text-[#0d9488] border border-[#0d9488]/20 h-14 rounded-xl font-900 uppercase text-[11px] tracking-widest transition-all hover:shadow-md cursor-pointer"><ThumbsUp size={16} /> Positive</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
