"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase/client";
import { 
  doc, getDoc, updateDoc, increment, collection, addDoc, 
  serverTimestamp, query, where, getDocs, runTransaction 
} from "firebase/firestore";
import { 
  MapPin, ArrowLeft, Share2, Heart, ShieldCheck, UserCircle, 
  Clock, Gavel, ShoppingCart, ThumbsUp, Minus, ThumbsDown, Zap,
  MessageSquare, Gavel as GavelIcon
} from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider"; 
import { useCart } from "@/context/CartContext";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConnect, useSwitchChain } from "wagmi";
import { parseEther } from "viem"; // Used to convert the bid amount string to Wei smoothly
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function AssetDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
// ⚡ DESTRUCTURE YOUR CART CONTEXT BINDINGS HERE:
  const { addItem, setIsCartOpen } = useCart();
  
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState("SYNCING...");
  const [isVoting, setIsVoting] = useState(false);
  const { user } = useAuth(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("Hello, I am interested in this item. Is it still available?");
  const [isSending, setIsSending] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"fiat" | "crypto" | null>(null);

// 🛡️ Asset Category Identifier (Matches your Firestore document)
const isDigital = asset?.category === 'digital-asset';

 // 🛡️ DUAL-TRACK BIDDING STATE HOOKS (KEEP THESE)
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  
  // (Note: Make sure your `paymentMethod` and `isDigital` variables are also defined right here if they aren't already!)

 // 🚀 Auto-Route Digital Assets straight to Crypto Checkout
  useEffect(() => {
    // Check if asset is loaded and category is digital-asset
    const isDigitalAsset = asset?.category === 'digital-asset';
    
    if (isBidModalOpen && isDigitalAsset) {
      setPaymentMethod("crypto");
    } else if (!isBidModalOpen) {
      setPaymentMethod(null); 
      setBidAmount("");
    }
  }, [isBidModalOpen, asset]); // Added 'asset' as a dependency

  // ⚡ WAGMI WEB3 HOOKS FOR ON-CHAIN INTERACTION
  const { isConnected, address: walletAddress, chainId: currentWalletChainId } = useAccount();
  const { writeContractAsync, data: txHash } = useWriteContract();
  const { switchChainAsync } = useSwitchChain(); // 🔄 Pulls down explicit network shifting controls
  
  // Real-Time Listing Document Sync Loop
  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, "listings", id as string);
    try {
      const docSnap = getDoc(docRef).then((snap) => {
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() } as any;
          setAsset(data);
          setActiveImage(data.imageUrl || data.image || data.images?.[0] || null);
        }
        setLoading(false);
      });
    } catch (err) { 
      console.error(err); 
      setLoading(false);
    }
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

 // 🎯 Extract the true 9-character value directly from your database asset object properties
  const rawAssetCode = asset?.product_code || asset?.xid || id || "OFVU0";
  
  // 🎯 ULTRA-PURE IDENTITY: Extract the code and aggressively strip out any hardcoded "XID-" prefixes
  const databaseAssetID = rawAssetCode
    .toString()
    .replace(/^XID-/i, '') // 🧼 Strips "XID-" or "xid-" from the start if it exists
    .toUpperCase()
    .trim();

  const handleBuyClick = () => {
    if (!user) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    // ⚡ 1. Commit the asset payload to your global cart context before transitioning or opening UI layouts
    addItem({
      id: databaseAssetID, // 🔒 Connected to the pure prefix-free identity string!
      name: asset?.title || asset?.name || "Asset Item",
      title: asset?.title || asset?.name || "Asset Item",
      price: Number(buyNowPrice || asset?.price || 0),
      quantity: 1,
      image: asset?.image || asset?.imageUrl || "",
      ownerId: asset?.sellerAddress || "steward_node"
    });

    // ⚡ 2. Fire events to secure real-time UI synchronization across sibling headers
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("cart-updated"));

    // ⚡ 3. Open the ledger drawer so it pops open seamlessly with your newly loaded item!
    if (typeof setIsCartOpen === "function") {
      setIsCartOpen(true);
    }

    // ⚡ 4. Route to check out as originally designed
    router.push("/market/checkout");
  };

  // 🔨 LIVE TRIGGER: PRE-CALCULATES MINIMUM REQUIREMENT AND REVEALS MODAL INTERFACE
  const handlePlaceBidClick = () => {
    if (!user) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    if (!asset) return;

    if (user.uid === (asset.merchantId || asset.userId || asset.sellerId)) {
      alert("Sovereign Security Rule: Self-bidding is strictly prohibited.");
      return;
    }

    // ⚡ 1. Also load the item into the state tracker here so the drawer stays populated
    addItem({
      id: id as string,
      name: `${asset?.title || "Asset Item"} (Bid Commitment)`,
      title: `${asset?.title || "Asset Item"} (Bid Commitment)`,
      price: Number(currentBid || asset?.startingBid || buyNowPrice || 0),
      quantity: 1,
      image: asset?.image || asset?.imageUrl || "",
      sellerAddress: asset?.sellerAddress || "steward_node",
      ownerId: asset?.sellerAddress || "steward_node"
    });

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("cart-updated"));

    // ⚡ 2. Keep your existing modal bidding operations running
    const currentHighVal = Number(asset.currentBid) || Number(asset.startingBid) || 0;
    const recommendedNextBid = currentHighVal + 250;
    setBidAmount(recommendedNextBid.toString());
    setIsBidModalOpen(true);
  };

// 🔨 ATOMIC HYBRID ON-CHAIN & CLOUD TRANSACTION EXECUTOR HOOK
  const handleExecuteBidTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSubmittingBid || !asset || !id) return;

    // 🔒 Web3 Gate: Ensure wallet connection before allowing submission
    if (!isConnected) {
      alert("Web3 Security Protocol: Please connect your Web3 wallet to submit an on-chain bid.");
      return;
    }

    const proposedBidNumeric = Number(bidAmount);
    if (isNaN(proposedBidNumeric) || proposedBidNumeric <= 0) {
      alert("Invalid capital configuration. Please specify a solid numerical value.");
      return;
    }

    setIsSubmittingBid(true);
    const listingDocRef = doc(db, "listings", id as string);

    try {
      // 1. Fetch latest prices out of Firestore first for a rapid guardrail check
      const latestSnap = await getDoc(listingDocRef);
      if (!latestSnap.exists()) throw new Error("Target asset missing inside primary database cluster.");
      
     // 1. Fetch latest prices
      const freshAssetData = latestSnap.data();
      
      // 2. Logic Split: Buy-Now vs Auction
      let minRequired;
      
      if (!isAuction) {
        // DIRECT BUY MODE: The price is fixed at the Buy Now amount.
        minRequired = Number(freshAssetData.buyNowPrice || freshAssetData.price);
      } else {
        // AUCTION MODE: High Bid + 10% Increment
        const freshHighBid = Number(freshAssetData.currentBid) || Number(freshAssetData.startingBid) || 0;
        
        // Dynamic 10% increment calculation, ensuring at least a $1 minimum step
        const increment = Number(freshAssetData.bidIncrement) || Math.max(1, freshHighBid * 0.10);
        
        minRequired = freshHighBid + increment;
      }

      // 3. Final Validation
      if (proposedBidNumeric < minRequired) {
        throw new Error(`Minimum required for this asset is $${minRequired.toLocaleString()}.`);
      }

      // 🔄 AUTOMATIC Web3 NETWORK FORCE-SWITCH PROFILE GUARDRAIL
      const AMOY_CHAIN_ID = 80002;
      if (currentWalletChainId !== AMOY_CHAIN_ID && switchChainAsync) {
        alert("Network Sync: Shifting your connected wallet instance onto Polygon Amoy Testnet...");
        await switchChainAsync({ chainId: AMOY_CHAIN_ID });
      }

   // 🎯 VERIFIED TARGET DESTINATIONS ON POLYGON AMOY
const USDC_MARKET_ADDRESS = "0x875B0406cAfeE6C097065c9979aFdFd6058b609b";
const MARKETPLACE_CONTRACT = "0x7c211077dBb177a4b2a551DA7CdC3D53b04Cbdb7";
const AUCTION_CONTRACT = asset?.contractAddress || "0xcd42C1CcC329E946c896caf85BBF4F7559D9c8B3";

// 👉 The Smart Router
const TARGET_CONTRACT = isDigital ? MARKETPLACE_CONTRACT : AUCTION_CONTRACT;
const USDC_ADDRESS = isDigital ? USDC_MARKET_ADDRESS : "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582";
      
      // USDC uses 6 decimals instead of 18. Calculate exact integer token balance:
      const usdcAtomicValue = BigInt(Math.floor(proposedBidNumeric * 1_000_000));

      alert(`Step 1 of 2: Authorizing the Bazaria ${isDigital ? 'Marketplace' : 'Auction'} contract to secure your USDC allocation...`);

      // A. CONTRACT CALL: ALLOW THE TARGET ENGINE TO SPEND YOUR USDC
      await writeContractAsync({
        chainId: AMOY_CHAIN_ID,
        address: USDC_ADDRESS as `0x${string}`,
        abi: [
          {
            inputs: [
              { name: "_spender", type: "address" },
              { name: "_value", type: "uint256" }
            ],
            name: "approve",
            outputs: [{ name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function"
          }
        ],
        functionName: "approve",
        // 🚀 DYNAMIC ROUTING: Approves the TARGET_CONTRACT, not just the auction!
        args: [TARGET_CONTRACT as `0x${string}`, usdcAtomicValue],
        maxPriorityFeePerGas: BigInt(30_000_000_000),
        maxFeePerGas: BigInt(50_000_000_000),
      });

      alert("Step 2 of 2: Allocation authorized! Executing your high bid placement on-chain...");

      // B. CONTRACT CALL: SUBMIT EXPLICITLY TO THE AUCTION ENGINE
      await writeContractAsync({
        chainId: AMOY_CHAIN_ID,
        address: AUCTION_CONTRACT as `0x${string}`, 
        abi: [
          {
            inputs: [
              { name: "_listingId", type: "string" },
              { name: "_amount", type: "uint256" }
            ],
            name: "placeBid",
            outputs: [],
            stateMutability: "nonpayable", // USDC uses transferFrom
            type: "function",
          }
        ],
        functionName: "placeBid",
        args: [id as string, usdcAtomicValue],
        // 🚀 OVERRIDE GAS PACKAGING TO SURPASS AMOY TESTNET VALIDATOR MINIMUMS:
        maxPriorityFeePerGas: BigInt(30_000_000_000),
        maxFeePerGas: BigInt(50_000_000_000),
      });

      // 3. 🗺️ SYNCHRONIZE CLOUD RECORD ATOMICALLY AFTER TRANSACTION CLEARS
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(listingDocRef);
        if (!sfDoc.exists()) throw new Error("Document does not exist!");
        
        const freshAssetDataInner = sfDoc.data();
        const freshHighBidInner = Number(freshAssetDataInner.currentBid) || Number(freshAssetDataInner.startingBid) || 0;
        
        if (proposedBidNumeric <= freshHighBidInner) {
          throw new Error("A higher counter-bid was verified mid-flight. Transaction aborted.");
        }

        // Lock values seamlessly inside your database cloud logs
        transaction.update(listingDocRef, {
          currentBid: proposedBidNumeric,
          highBidderId: user.uid,
          highBidderEmail: user.email || "Anonymous Collector",
          bidsCount: (freshAssetDataInner.bidsCount || 0) + 1,
          lastBidTimestamp: new Date().toISOString()
        });
      });

      setIsBidModalOpen(false);
      setBidAmount("");
      alert("Transaction verified! Your secure USDC high bid has cleared on-chain and in cloud records.");
      
    } catch (err: any) {
      console.error("Auction transaction stack rejected: ", err);
      alert(err.message || "Bidding pipeline execution failed. Please verify token balances or gas parameters.");
    } finally {
      setIsSubmittingBid(false);
    }
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

 // --- TIMER HELPER ---
  const calculateTimeLeft = (targetTime: number) => {
    const diff = targetTime - Date.now();
    if (diff <= 0) return "EXPIRED";
    
    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    
    return days > 0 ? `${days}D : ${hours}H : ${minutes}M` : `${hours}H : ${minutes}M`;
  };

  // --- STABILIZED TIMER EFFECT ---
useEffect(() => {
    if (!asset) return;

    // 1. Calculate and LOCK the targetTime OUTSIDE the interval
    let target = asset.endTime || asset.endsAt;
    let finalTargetTime: number;

    if (target) {
      finalTargetTime = new Date(target).getTime();
    } else {
      const rawDate = asset.createdAt || asset.timestamp;
      let createdDate: number;

      // Handle Firestore timestamps vs Standard dates safely
      if (rawDate && typeof rawDate === 'object' && 'seconds' in rawDate) {
        createdDate = rawDate.seconds * 1000;
      } else if (rawDate && !isNaN(new Date(rawDate).getTime())) {
        createdDate = new Date(rawDate).getTime();
      } else {
        // Fallback only if absolutely no date data exists
        createdDate = Date.now();
      }

      const category = (asset.category || asset.type || "general").toLowerCase();
      let daysToAdd = 3;
      if (category.includes('property') || category.includes('homes') || category.includes('villa')) daysToAdd = 30;
      else if (category.includes('mobility') || category.includes('auto') || category.includes('marine')) daysToAdd = 7;
      
      finalTargetTime = createdDate + (daysToAdd * 24 * 60 * 60 * 1000);
    }

    // 2. Start the interval to tick down against the locked target
    const interval = setInterval(() => {
      const difference = finalTargetTime - Date.now();
      
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

  // ⚓ IDENTIFY MARITIME VERTICAL TO ADJUST FIELD LABELS DYNAMICALLY
  const isMarineAsset = asset.category === 'marine';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] pb-20 font-sans overflow-x-hidden text-left">
      
      {/* 🖨️ EMBEDDED PRINT LAYOUT MEDIA SYSTEM */}
      <style jsx global>{`
        @media print {
          html, body, .min-h-screen, main, div, body * {
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            background-color: #ffffff !important;
            color: #000000 !important;
            position: static !important;
          }
          nav {
            position: relative !important;
            background-color: #030712 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          aside, nav button, button, .filmstrip-container, .no-print, .animate-ping, div[class*="Concierge"], div[class*="chat"], div[class*="sidebar"], .sidebar, div[style*="fixed"], div[style*="absolute"] {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }
          main, div[class*="max-w-"], div[style*="padding"] {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
          }
          .showcase-canvas {
            display: block !important;
            box-shadow: none !important;
            border: none !important;
            margin-bottom: 40px !important;
            page-break-after: always !important;
            break-after: always !important;
            text-align: center !important;
          }
          .showcase-canvas img {
            max-height: 450px !important;
            width: auto !important;
            display: block !important;
            margin: 0 auto !important;
          }
          .showcase-canvas img {
            max-height: 450px !important;
            width: auto !important;
            display: block !important;
            margin: 0 auto !important;
          }
          .showcase-container {
            display: block !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 16px !important;
            padding: 24px !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-top: 30px !important;
          }
          .matrix-container > div {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
      `}</style>

      {/* 👑 PREMIUM IDENTITY NAVIGATION BAR */}
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
        
        {/* LEFT COLUMN: CANVAS SHOWCASE */}
        <div className="lg:col-span-7 flex flex-col min-w-0">
          
          <div className="showcase-canvas" style={{ position: 'relative', width: '100%', backgroundColor: '#ffffff', borderRadius: '32px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}>
            <div className="absolute" style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 40 }}>
              
              {/* 🔗 SHARE BUTTON: Copies link directly to clipboard */}
              <div 
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    alert("Listing link copied to clipboard!");
                  } catch (err) {
                    console.error("Clipboard capture fault:", err);
                  }
                }}
                style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#0f172a', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', cursor: 'pointer', justifyContent: 'center', transition: 'all 0.2s' }}
              >
                <Share2 size={18} />
              </div>
              
              {/* ❤️ HEART INTERACTIVE TOGGLE */}
              <div 
                onClick={() => setIsLiked(!isLiked)}
                style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '12px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  color: isLiked ? '#f43f5e' : '#64748b', 
                  display: 'flex', 
                  alignItems: 'center', 
                  border: '1px solid #e2e8f0', 
                  cursor: 'pointer', 
                  justifyContent: 'center', 
                  transition: 'all 0.2s' 
                }}
              >
                <Heart 
                  size={18} 
                  className={isLiked ? "fill-rose-500 text-rose-500" : "text-gray-400"} 
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '480px', padding: '40px 20px', backgroundColor: '#ffffff' }}>
              {activeImage && <img src={activeImage} style={{ maxHeight: '500px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }} alt="Asset" />}
            </div>
            
            <div className="filmstrip-container" style={{ padding: '20px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                {allImages.map((url, idx) => (
                  <button key={idx} onClick={() => setActiveImage(url)} style={{ width: '85px', height: '85px', minWidth: '85px', flexShrink: 0, backgroundColor: '#ffffff', border: activeImage === url ? '3px solid #05292e' : '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', padding: 0, cursor: 'pointer' }}><img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></button>
                ))}
              </div>
            </div>
          </div>

  <div className="matrix-container" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '32px', padding: '24px', marginTop: '24px', boxShadow: '0 15px 30px -10px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '16px' }}>Verified Asset Specifications</span>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
              
             {/* 📐 Lot Area: Handles Meter vs Foot Configurations dynamically */}
              {Boolean(asset.lotSize && Number(asset.lotSize) > 0) && (
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Lot Area</p>
                  <p style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                    {asset.lotSize}{' '}
                    <span className="text-[#0d9488] text-[10px] font-bold">
                      {String(asset.lotSizeUnit || asset.areaUnit || asset.unitType || '')
                        .toLowerCase()
                        .includes('meter') || 
                       String(asset.lotSizeUnit || asset.areaUnit || asset.unitType || '')
                        .toLowerCase() === 'm2'
                        ? 'SQ METERS'
                        : 'SQ FEET'}
                    </span>
                  </p>
                </div>
              )}

              {/* 🛏️ Bedroom Configuration Component */}
              {Boolean(asset.beds || asset.bedrooms) && (
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Configuration</p>
                  <p style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>{asset.beds || asset.bedrooms} BD</p>
                </div>
              )}

             {/* 🛁 Bathrooms - Safely handles decimal/half-baths (e.g., 3.5 BA) */}
              {Boolean(asset.baths || asset.bathrooms) && (
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Bathrooms</p>
                  <p style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>{asset.baths || asset.bathrooms} BA</p>
                </div>
              )}
              
             {/* ⚓ EXTENSION: PROPULSION MECHANICAL SETUP DETAILS CONTAINER */}
              {isMarineAsset && asset.engineDetails && (
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', gridColumn: 'span 1' }}>
                  <p style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Engine Configuration</p>
                  <p style={{ fontSize: '13px', fontWeight: 900, color: '#0f172a', lineHeight: '1.2' }}>{asset.engineDetails}</p>
                </div>
              )}
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Condition Status</p>
                <p style={{ fontSize: '16px', fontWeight: 900, color: '#0d9488' }}>{asset.condition || "Mint"}</p>
              </div>
            </div> {/* Closes display grid */}
          </div> {/* ✨ FIXED: This closes your master matrix-container wrapper card cleanly! */}

{/* 📝 RESTORED DYNAMIC ASSET NARRATIVE DATA BLOCK */}
          {Boolean(asset.description || asset.narrative) && (
            <div style={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '32px', 
              padding: '32px', 
              marginTop: '24px', 
              boxShadow: '0 15px 30px -10px rgba(0,0,0,0.03)' 
            }}>
              <span style={{ 
                fontSize: '10px', 
                fontWeight: 900, 
                color: '#0d9488', 
                textTransform: 'uppercase', 
                letterSpacing: '1px', 
                display: 'block', 
                marginBottom: '14px' 
              }}>
                Asset Narrative
              </span>
              <p style={{ 
                fontSize: '13px', 
                fontWeight: 500, 
                color: '#334155', 
                lineHeight: '1.7', 
                margin: 0,
                whiteSpace: 'pre-line' // 🧼 Keeps line breaks perfectly preserved
              }}>
                {asset.description || asset.narrative}
              </p>
            </div>
          )}

          
          {/* 🌐 External Market Index Reference Block */}
          {asset.mlsId && asset.mlsSourceUrl && (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '32px',
              padding: '24px',
              marginTop: '24px',
              boxShadow: '0 15px 30px -10px rgba(0,0,0,0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={14} className="text-[#0d9488]" strokeWidth={2.5} />
                  <span style={{ fontSize: '10px', fontWeight: 900, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    External Market Index Reference
                  </span>
                </div>
                <p style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', margin: 0, marginTop: '2px' }}>
                  Cross-Reference ID: <span style={{ fontFamily: 'monospace', color: '#64748b' }}>{asset.mlsId}</span>
                </p>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', margin: 0 }}>
                  This independent listing provides a third-party reference link to external public property indexes for historical filings and disclosure convenience.
                </p>
              </div>
              <a
                href={asset.mlsSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#030712',
                  color: '#FFBF00',
                  border: '1px solid #FFBF00',
                  padding: '12px 20px',
                  borderRadius: '16px',
                  fontSize: '11px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                className="hover:bg-slate-900 duration-200 no-print"
              >
                External Record ↗
              </a>
            </div>
          )}

</div> {/* ✨ FIXED: This closes your left column container (e.g., lg:col-span-7) cleanly before starting the sidebar! */}
          
        {/* RIGHT COLUMN: PREMIUM SIDEBAR TERMINAL */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-200/60 flex flex-col gap-6">
            
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-5">
              <div style={{ backgroundColor: '#030712', padding: '10px 16px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyStyle: 'space-between', border: '1px solid #FFBF00', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} className="text-[#FFBF00]" strokeWidth={2.5} />
                  <span style={{ fontSize: '9px', fontWeight: 1000, color: '#FFBF00', letterSpacing: '0.5px' }} className="uppercase">Identity Verified</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', fontFamily: 'monospace' }}>{asset.storeWebsite || 'bluemerchant@bazaria.site'}</span>
              </div>
              
              <h1 className="text-3xl font-1000 uppercase tracking-tight mt-2 text-slate-900">{asset.title}</h1>

              {/* 📍 Premium Geographic Asset Anchor (Renders dynamically if fields exist) */}
              {Boolean(asset.location || asset.city || asset.province) && (
                <div className="flex items-center gap-2 text-slate-500 mt-1 pl-0.5">
                  <MapPin size={13} className="text-[#0d9488] flex-shrink-0" strokeWidth={2.5} />
                  <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.3px' }} className="uppercase text-slate-500">
                    {[asset.location, asset.city, asset.province].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyStyle: 'space-between', backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '20px', border: '1px solid #e2e8f0', justifyContent: 'space-between' }}>



        
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
  onClick={handlePlaceBidClick} 
  style={{ 
    background: 'linear-gradient(135deg, #0d9488 0%, #05292e 100%)', 
    border: 'none',
    cursor: 'pointer'
  }} 
  className="h-[60px] text-white rounded-2xl font-black uppercase text-xs tracking-wider shadow-md"
>
  🔒 Place Secure Bid
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

              <button 
                onClick={() => router.push('/market')} 
                className="h-[50px] border border-slate-200 text-[#64748b] bg-transparent rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all cursor-pointer"
              >
                Client Dashboard Portal
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* LOWER SECTION: TRUST AUTHORITY CARD */}
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button onClick={() => handlePulseVote('neutral')} className="flex items-center justify-center gap-3 bg-white text-[#fbbf24] border border-[#fbbf24]/20 h-14 rounded-xl font-900 uppercase text-[10px] tracking-widest transition-all hover:shadow-md cursor-pointer"><Minus size={14} /> Neutral</button>
                  <button onClick={() => handlePulseVote('negative')} className="flex items-center justify-center gap-3 bg-white text-[#f43f5e] border border-[#f43f5e]/20 h-14 rounded-xl font-900 uppercase text-[10px] tracking-widest transition-all hover:shadow-md cursor-pointer"><ThumbsDown size={14} /> Negative</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 🛡️ INQUIRY MODAL */}
      {isModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(3, 29, 32, 0.4)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ backgroundColor: "#ffffff", color: "#05292e", borderRadius: "28px", padding: "36px", maxWidth: "500px", width: "100%", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontSize: "9px", fontWeight: 900, color: "#0d9488", letterSpacing: '1px', textTransform: "uppercase", display: 'block' }}>Secure Communication Protocol</span>
             <h3 style={{ fontSize: "20px", fontWeight: 1000, margin: "6px 0 0 0", textTransform: "uppercase" }}>
  {saleMode === 'auction' ? 'Place Secure Bid' : 'Direct Asset Checkout'}
</h3>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "6px 0 0 0", fontWeight: 600, lineHeight: '1.4' }}>Your message will instantly establish an encrypted communication thread with the seller.</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#f8fafc", padding: "12px 16px", borderRadius: "16px", marginBottom: "24px", border: "1px solid #e2e8f0" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "10px", backgroundColor: "#05292e", display: "flex", alignItems: "center", flexShrink: 0, overflow: "hidden", justifyContent: "center" }}>
                {activeImage ? <img src={activeImage} alt={asset?.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <MessageSquare size={18} color="#FFBF00" />}
              </div>
              <div style={{ overflow: "hidden" }}>
                <h4 style={{ fontSize: "13px", fontWeight: 1000, margin: 0, color: "#05292e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{asset?.title}</h4>
                <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 700, fontFamily: 'monospace' }}>ID: {id}</span>
              </div>
            </div>
            <form onSubmit={handleSendInquiry} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} required rows={4} style={{ width: "100%", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "16px", padding: "16px", fontSize: "13px", fontWeight: 600, color: "#05292e", outline: "none", resize: "none", lineHeight: "1.5", boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: "14px", backgroundColor: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "16px", fontWeight: 800, fontSize: "11px", textTransform: "uppercase", cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={isSending} style={{ flex: 2, padding: "14px", backgroundColor: "#030712", color: "#FFBF00", border: "1px solid #FFBF00", borderRadius: "16px", fontWeight: 1000, fontSize: "11px", textTransform: "uppercase", cursor: "pointer", opacity: isSending ? 0.6 : 1 }}>{isSending ? "SECURE SYNCING..." : "SEND SECURE MESSAGE"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
{isBidModalOpen && (
  <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(3, 29, 32, 0.4)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
    <div style={{ backgroundColor: "#ffffff", color: "#05292e", borderRadius: "28px", padding: "36px", maxWidth: "460px", width: "100%", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)", border: "1px solid #14b8a6", display: "flex", flexDirection: "column", boxSizing: "border-box", maxHeight: "90vh", overflowY: "auto" }}>
      
      <div style={{ marginBottom: "20px" }}>
        <span style={{ fontSize: "9px", fontWeight: 900, color: "#0d9488", letterSpacing: '1.5px', textTransform: "uppercase", display: 'block' }}>Sovereign Ledger Entry Protocol</span>
        <h3 style={{ fontSize: "20px", fontWeight: 1000, margin: "6px 0 0 0", textTransform: "uppercase" }}>Place Secure Bid</h3>
        <p style={{ fontSize: "11px", color: "#64748b", margin: "4px 0 0 0", fontWeight: 600, lineHeight: '1.4' }}>Select your payment profile rail to complete your atomic asset bid commitment.</p>
      </div>

      {(!isDigital && paymentMethod === null) ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <button type="button" onClick={() => setPaymentMethod("fiat")} style={{ width: "100%", padding: "18px", backgroundColor: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: "16px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "4px", textAlign: "left" }}>
            <span style={{ fontWeight: 900, fontSize: "13px", color: "#05292e" }}>💳 Card / Bank Checkout</span>
            <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 500 }}>Supports Apple Pay, Google Pay, and high-limit ACH bank rails.</span>
          </button>
          <button type="button" onClick={() => setPaymentMethod("crypto")} style={{ width: "100%", padding: "18px", backgroundColor: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: "16px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "4px", textAlign: "left" }}>
            <span style={{ fontWeight: 900, fontSize: "13px", color: "#05292e" }}>🪙 Digital Wallet (Web3 Crypto)</span>
            <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 500 }}>Direct settlement natively using secure USDC Stablecoin.</span>
          </button>
          <button type="button" onClick={() => setIsBidModalOpen(false)} style={{ marginTop: "10px", padding: "14px", backgroundColor: "transparent", color: "#64748b", border: "none", fontWeight: 800, fontSize: "11px", textTransform: "uppercase", cursor: "pointer" }}>
            Close Window
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {(paymentMethod === "crypto" || isDigital) && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <label style={{ fontSize: "9px", color: "#64748b", fontWeight: 900, textTransform: "uppercase" }}>Crypto Bid Amount (USDC)</label>
              <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} required placeholder="Enter USDC Value" style={{ width: "100%", padding: "14px", border: "1px solid #cbd5e1", borderRadius: "16px", boxSizing: "border-box", fontSize: "14px", fontWeight: 700 }} />
              <button onClick={handleExecuteBidTransaction} style={{ width: "100%", padding: "16px", backgroundColor: "#05292e", color: "#ffffff", borderRadius: "16px", border: "none", fontWeight: 800, cursor: "pointer" }}>BUY NOW WITH USDC</button>
            </div>
          )}
          {paymentMethod === "fiat" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "9px", color: "#64748b", fontWeight: 900, textTransform: "uppercase" }}>{isAuction ? 'Fiat Bid Amount (USD)' : 'Checkout Total (USD)'}</label>
              {isAuction ? (
                <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} required placeholder="Enter Dollar Value" style={{ width: "100%", padding: "14px", border: "1px solid #cbd5e1", borderRadius: "16px", boxSizing: "border-box", fontSize: "14px", fontWeight: 700 }} />
              ) : (
                <div style={{ width: "100%", padding: "14px", border: "1px solid #cbd5e1", borderRadius: "16px", backgroundColor: "#f8fafc", boxSizing: "border-box", fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                  ${Number(asset?.buyNowPrice || asset?.price).toLocaleString()} USD
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
)}

                        return (
                          <div style={{ backgroundColor: "#f8fafc", padding: "14px", borderRadius: "16px", border: "1px solid #e2e8f0", fontSize: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                            
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                              <span>Target Purchase Price:</span>
                              <span style={{ fontWeight: 700, marginLeft: "auto", color: "#0f172a" }}>
                                ${currentBidNum.toLocaleString()} USD
                              </span>
                            </div>

                            {/* 🔀 DYNAMIC INTERFACE ROUTING */}
                            {!isHighTicket ? (
                              /* 🛒 STANDARD BUY RETAIL INTERFACE */
                              <>
                                <div style={{ display: "flex", justifyContent: "space-between", color: "#2563eb", fontWeight: 800, borderTop: "1px dashed #cbd5e1", paddingTop: "6px", fontSize: "13px" }}>
                                  <span>Subtotal Due Now:</span>
                                  <span style={{ marginLeft: "auto" }}>
                                    ${currentBidNum.toLocaleString()} USD
                                  </span>
                                </div>

                                <div style={{ marginTop: "4px", fontSize: "10px", color: "#1e3a8a", backgroundColor: "#eff6ff", padding: "12px", borderRadius: "14px", border: "1px solid #bfdbfe", lineHeight: "1.4" }}>
                                  <strong>🛒 Direct Purchase Mode:</strong> This item is paid in full instantly. 
                                  <span style={{ display: "block", marginTop: "4px", fontWeight: 600, color: "#1e40af" }}>
                                    * Note: Standard marketplace shipping handling fees will be calculated and invoiced separately to clear fulfillment logistics.
                                  </span>
                                </div>
                              </>
                            ) : (
                              /* 💼 HIGH-TICKET ESCROW INTERFACE */
                              <>
                                <div style={{ display: "flex", justifyContent: "space-between", color: "#0d9488", fontWeight: 800, borderTop: "1px dashed #cbd5e1", paddingTop: "6px", fontSize: "13px" }}>
                                  <span>Secure Hold Deposit (10%):</span>
                                  <span style={{ marginLeft: "auto" }}>
                                    ${escrowDepositAmount.toLocaleString()} USD
                                  </span>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "4px", backgroundColor: "#fef2f2", padding: "12px", borderRadius: "16px", border: "1px solid #fee2e2", marginTop: "4px", fontSize: "11px" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", color: "#991b1b", fontWeight: 700 }}>
                                    <span>⚠️ High-Ticket Cancellation Policy:</span>
                                    <span>10% Default Fine Applies</span>
                                  </div>
                                  <span style={{ color: "#7f1d1d", lineHeight: "1.4" }}>
                                    Because this asset requires off-platform settlement (e.g., DMV, Attorney office transfer), a 10% binder hold is secured in escrow. If you back out, <strong>only 90% (${refundAmountAfterDefault.toLocaleString()} USD) is returned</strong>; a 10% fine (${defaultFineAmount.toLocaleString()} USD) is forfeited.
                                  </span>
                                </div>
                              </>
                            )}

                            <div style={{ marginTop: "4px", fontSize: "10px", color: "#64748b", backgroundColor: "#ffffff", padding: "10px", borderRadius: "12px", border: "1px solid #e2e8f0", lineHeight: "1.5" }}>
                              <span style={{ fontWeight: 900, color: "#475569", display: "block", marginBottom: "2px", textTransform: "uppercase", fontSize: "9px" }}>
                                🛡️ Platform Structural Rules:
                              </span>
                              • <strong>Fulfillment Accord:</strong> Both buyers and sellers explicitly consent to these transactional fee layers upon committing bids.<br/>
                              • <strong>Success Fee Retention:</strong> Platform processing fees are parsed automatically from final settlement distributions.
                            </div>

                            {/* PayPal Gateway Context Hook */}
                            <div style={{ width: "100%", marginTop: "8px" }}>
                              <PayPalScriptProvider 
                                options={{ 
                                  "client-id": "test",
                                  intent: isHighTicket ? "authorize" : "capture" 
                                }}
                              >
                                <PayPalButtons
                                  style={{ layout: "vertical", shape: "rect", color: "gold", height: 45 }}
                                  disabled={isSubmittingBid || !bidAmount || currentBidNum <= 0}
                                  createOrder={(data, actions) => {
                                    const processingValue = isHighTicket ? escrowDepositAmount.toFixed(2) : currentBidNum.toFixed(2);
                                    return actions.order.create({
                                      intent: isHighTicket ? "AUTHORIZE" : "CAPTURE",
                                      purchase_units: [
                                        {
                                          amount: {
                                            currency_code: "USD",
                                            value: processingValue
                                          },
                                          description: isHighTicket 
                                            ? `10% Escrow Deposit Hold for High-Ticket Asset #${id}`
                                            : `100% Full Payment Checkout for Regular Asset Listing #${id}`
                                        }
                                      ]
                                    });
                                  }}
                                  onApprove={async (data, actions) => {
                                    setIsSubmittingBid(true);
                                    try {
                                      let authId = "direct_capture";
                                      
                                      if (isHighTicket) {
                                        const authorization = await actions.order?.authorize();
                                        authId = authorization?.purchase_units[0]?.payments?.authorizations[0]?.id || "";
                                        if (!authId) throw new Error("Escrow validation handshake rejected.");
                                      } else {
                                        const capture = await actions.order?.capture();
                                        if (capture?.status !== "COMPLETED") throw new Error("Full checkout collection timeline failed.");
                                      }

                                      const listingDocRef = doc(db, "listings", id as string);
                                      await runTransaction(db, async (transaction) => {
                                        const sfDoc = await transaction.get(listingDocRef);
                                        if (!sfDoc.exists()) throw new Error("Target asset record missing inside database.");
                                        
                                        transaction.update(listingDocRef, {
                                          currentBid: currentBidNum,
                                          highBidderId: user?.uid || "anonymous_fiat_user",
                                          highBidderEmail: user?.email || "Anonymous Collector",
                                          status: isHighTicket ? "HOLD" : "SOLD", 
                                          paymentType: "fiat",
                                          escrowProfile: {
                                            paymentGateway: "paypal",
                                            checkoutWorkflowMode: isHighTicket ? "HIGH_TICKET_ESCROW" : "DIRECT_FULL_PAYMENT",
                                            paypalAuthorizationId: isHighTicket ? authId : "DIRECT_CAPTURED",
                                            totalCommittedPrice: currentBidNum,
                                            depositAmountInEscrow: isHighTicket ? escrowDepositAmount : currentBidNum,
                                            totalPlatformRevenueCollected: totalPlatformRevenueLog,
                                            buyerChargedFee: isHighTicket ? baseReserveFee : standardPlatformFee,
                                            sellerOveragePerformanceCommissionDeduction: isHighTicket ? sellerOveragePerformanceCommission : 0,
                                            buyerSatisfactionReleased: !isHighTicket, 
                                            sellerSatisfactionReleased: !isHighTicket
                                          }
                                        });
                                      });

                                      setPaymentMethod(null);
                                      setBidAmount("");
                                      alert(isHighTicket 
                                        ? "Escrow Hold Active! High-ticket asset secured." 
                                        : "Purchase Complete! Full payment captured at the competitive 6% platform tier. Shipping will be coordinated separately."
                                      );
                                      
                                    } catch (err: any) {
                                      console.error("Gateway Processing Exception: ", err);
                                      alert(err.message || "Bidding configuration validation failure.");
                                    } finally {
                                      setIsSubmittingBid(false);
                                    }
                                  }}
                                />
                              </PayPalScriptProvider>
                            </div>
                          </div>
                        );
                      })() : (
                        <div style={{ fontSize: "11px", color: "#b45309", fontWeight: 700, backgroundColor: "#fffbeb", padding: "12px", borderRadius: "16px", border: "1px solid #fef3c7", textAlign: "center" }}>
                          Specify target item valuation to calculate transaction metrics.
                        </div>
                      )}

                      {/* Navigation Action Buttons Stack */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <button 
                          type="button" 
                          onClick={() => { setPaymentMethod(null); setBidAmount(""); }} 
                          style={{ width: "100%", padding: "14px", backgroundColor: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "16px", fontWeight: 800, fontSize: "11px", textTransform: "uppercase", cursor: "pointer" }}
                        >
                          Back to Payment Method Selection
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* CRYPTO WALLET RAIL INTERFACE (WAGMI / METAMASK / USDC TRACK) */}
                  {paymentMethod === "crypto" && (
                    <form onSubmit={handleExecuteBidTransaction} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "9px", color: "#64748b", fontWeight: 900, textTransform: "uppercase" }}>
                      Crypto Bid Amount (USDC)
                    </label>
                    <input 
                      type="number" 
                      value={bidAmount} 
                      onChange={(e) => setBidAmount(e.target.value)} 
                      required 
                      placeholder="Enter USDC Value" 
                      style={{ width: "100%", padding: "14px", border: "1px solid #cbd5e1", borderRadius: "16px", boxSizing: "border-box", fontSize: "14px", fontWeight: 700 }} 
                    />
                  </div>

                  
                  {Number(bidAmount) > 0 ? (() => {
                    const currentBidNum = Number(bidAmount);
                    const isHighTicket = currentBidNum >= 5000;

                    // Calculations mirrored from Fiat Rail
                    const escrowDepositAmount = currentBidNum * 0.10; 
                    const defaultFineAmount = escrowDepositAmount * 0.10;
                    const refundAmountAfterDefault = escrowDepositAmount * 0.90;

                    return (
                      <div style={{ backgroundColor: "#f8fafc", padding: "14px", borderRadius: "16px", border: "1px solid #e2e8f0", fontSize: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                          <span>Target Purchase Price:</span>
                          <span style={{ fontWeight: 700, marginLeft: "auto", color: "#0f172a" }}>
                            ${currentBidNum.toLocaleString()} USDC
                          </span>
                        </div>
                        
                        
                        {!isHighTicket ? (
                          /* 🛒 STANDARD CRYPTO CHECKOUT INTERFACE */
                          <>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#2563eb", fontWeight: 800, borderTop: "1px dashed #cbd5e1", paddingTop: "6px", fontSize: "13px" }}>
                              <span>Total Due On-Chain Now:</span>
                              <span style={{ marginLeft: "auto" }}>
                                {currentBidNum.toLocaleString()} USDC
                              </span>
                            </div>

                            <div style={{ marginTop: "4px", fontSize: "10px", color: "#1e3a8a", backgroundColor: "#eff6ff", padding: "12px", borderRadius: "14px", border: "1px solid #bfdbfe", lineHeight: "1.4" }}>
                              <strong>🛒 Direct Crypto Purchase:</strong> This transaction will clear full item allocation to the smart contract layer instantly.
                              <span style={{ display: "block", marginTop: "4px", fontWeight: 600, color: "#1e40af" }}>
                                * Note: Standard marketplace shipping logistics will be calculated and invoiced separately off-chain.
                              </span>
                            </div>
                          </>
                        ) : (
                          /* 💼 HIGH-TICKET CRYPTO ESCROW INTERFACE */
                          <>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#0d9488", fontWeight: 800, borderTop: "1px dashed #cbd5e1", paddingTop: "6px", fontSize: "13px" }}>
                              <span>Required Escrow Deposit (10%):</span>
                              <span style={{ marginLeft: "auto" }}>
                                {escrowDepositAmount.toLocaleString()} USDC
                              </span>
                            </div>

                            
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px", backgroundColor: "#fef2f2", padding: "12px", borderRadius: "16px", border: "1px solid #fee2e2", marginTop: "4px", fontSize: "11px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", color: "#991b1b", fontWeight: 700 }}>
                                <span>⚠️ Smart Contract Penalty Notice:</span>
                                <span>10% Fine Applies</span>
                              </div>
                              <span style={{ color: "#7f1d1d", lineHeight: "1.4", marginTop: "2px" }}>
                                By confirming this hold, your 10% security deposit is authorized into escrow. If you choose to back out or fail to finalize this transaction with the seller, <strong>only 90% ({refundAmountAfterDefault.toLocaleString()} USDC) will be refunded</strong>. A 10% penalty fine ({defaultFineAmount.toLocaleString()} USDC) will be withheld and distributed.
                              </span>
                            </div>
                          </>
                        )}

                        <div style={{ marginTop: "4px", fontSize: "10px", color: "#64748b", backgroundColor: "#ffffff", padding: "10px", borderRadius: "12px", border: "1px solid #e2e8f0", lineHeight: "1.5" }}>
                          <span style={{ fontWeight: 900, color: "#475569", display: "block", marginBottom: "2px", textTransform: "uppercase", fontSize: "9px" }}>
                            ⛓️ Web3 On-Chain Escrow Protocol:
                          </span>
                          • <strong>Fulfillment Accord:</strong> Placing this cryptographic call commits your public wallet address signature to the platform structural fee metrics.<br/>
                          • <strong>Success Fee Retention:</strong> Platform processing cuts are parsed programmatically upon fulfillment completion.
                        </div>
                      </div>
                    );
                  })() : (
                    <div style={{ fontSize: "11px", color: "#b45309", fontWeight: 700, backgroundColor: "#fffbeb", padding: "12px", borderRadius: "16px", border: "1px solid #fef3c7", textAlign: "center" }}>
                      Specify target item valuation to calculate on-chain escrow requirements.
                    </div>
                  )}

                  
                  <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                    <button 
                      type="button" 
                      onClick={() => { setPaymentMethod(null); setBidAmount(""); }} 
                      style={{ flex: 1, padding: "14px", backgroundColor: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "16px", fontWeight: 800, fontSize: "11px", textTransform: "uppercase", cursor: "pointer" }}
                    >
                      Back
                    </button>
                    
                    {!isConnected ? (
                      <button
                        type="button"
                        onClick={() => {
                          const injectedConnector = connectors?.find((c) => c.id === 'injected') || connectors?.[0];
                          if (injectedConnector) connect({ connector: injectedConnector });
                          else alert("No Web3 provider detected. Please launch MetaMask or your web3 browser extension.");
                        }}
                        style={{ flex: 2, padding: "14px", backgroundColor: "#FFBF00", color: "#05292e", border: "none", borderRadius: "16px", fontWeight: 1000, fontSize: "11px", textTransform: "uppercase", cursor: "pointer" }}
                      >
                        🔌 Connect Web3 Wallet
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmittingBid || !bidAmount || Number(bidAmount) <= 0}
                        style={{ flex: 2, padding: "14px", backgroundColor: "#05292e", color: "#FFBF00", border: "1px solid #FFBF00", borderRadius: "16px", fontWeight: 1000, fontSize: "11px", textTransform: "uppercase", cursor: (isSubmittingBid || !bidAmount || Number(bidAmount) <= 0) ? "not-allowed" : "pointer", opacity: (isSubmittingBid || !bidAmount || Number(bidAmount) <= 0) ? 0.6 : 1 }}
                      >
                        {isSubmittingBid ? "TRANSACTION SIGNING..." : (Number(bidAmount) >= 5000 ? "🔒 LOCK DEPOSIT ON-CHAIN" : "🛒 BUY NOW WITH USDC")}
                       </button>

                        )}

                      </div>

                    </form>

                  )}

                </div>

              )}



            </div>

          </div>

        )}



   </div>

  );

}        


