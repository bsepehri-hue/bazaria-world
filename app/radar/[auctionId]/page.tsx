"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db, auth } from "@/lib/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot, runTransaction, collection, serverTimestamp } from "firebase/firestore";
import { FaGavel, FaClock, FaShieldAlt, FaExternalLinkAlt } from "react-icons/fa";

interface AuctionData {
  assetName: string;
  assetImageUrl: string;
  currentBid: number;
  minIncrement: number;
  endTime: string;
  status: string;
}

export default function RadarBiddingPage({ 
  params, 
  searchParams 
}: { 
  params: { auctionId: string }; 
  searchParams: any 
}) {
  const assetId = params.auctionId; // The unique cryptographic XID parameter

  // 🏛️ Shared Component States
  const [auction, setAuction] = useState<AuctionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("00:00");
  const [user, setUser] = useState<User | null>(null);

  // Parse safety legal timestamps sent via deep link parameters
  const notificationReceivedAt = searchParams?.notifiedAt || new Date().toLocaleTimeString();

  // 🔐 Watch User Authentication State
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  // ==========================================
  // MODULE 1: REAL-TIME FIRESTORE HUD STREAM
  // ==========================================
  useEffect(() => {
    if (!assetId) {
      setError("Missing dynamic tracking signature configuration.");
      setLoading(false);
      return;
    }

    console.log(`📡 Initializing live radar interception stream for: ${assetId}`);
    const auctionDocRef = doc(db, "listings", assetId);

    const unsubscribeStream = onSnapshot(
      auctionDocRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setError("Asset listing identity metadata missing from database.");
          setLoading(false);
          return;
        }

        const data = snapshot.data();
        setAuction({
          assetName: data.title || "Premium Marketplace Listing Asset",
          assetImageUrl: data.imageUrl || data.media?.[0] || "",
          currentBid: Number(data.currentBid) || Number(data.startingPrice) || 0,
          minIncrement: Number(data.bidIncrement) || 50.00,
          endTime: data.endTime?.seconds ? new Date(data.endTime.seconds * 1000).toISOString() : data.endTime || "",
          status: data.status || "active",
        });
        setLoading(false);
      },
      (err) => {
        console.error("Firestore stream intercept error:", err);
        setError("Network connection dropped by host database layer.");
        setLoading(false);
      }
    );

    return () => unsubscribeStream();
  }, [assetId]);

  // ==========================================
  // MODULE 2: IMMUTABLE COUNTDOWN STOPWATCH
  // ==========================================
  useEffect(() => {
    if (!auction?.endTime) return;

    const calculateTime = () => {
      const difference = +new Date(auction.endTime) - +new Date();
      if (difference <= 0) {
        setTimeLeft("HAMMER DOWN");
        return;
      }

      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeLeft(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    };

    calculateTime();
    const intervalId = setInterval(calculateTime, 1000);
    return () => clearInterval(intervalId);
  }, [auction?.endTime]);

  // ==========================================
  // MODULE 3: SECURE ACQUISITION MUTATION THREAD
  // ==========================================
  const handlePlaceBid = async () => {
    if (!user) {
      alert("🔒 Authentication Required: Access denied. Please register or log in.");
      return;
    }
    if (timeLeft === "HAMMER DOWN") {
      alert("🚫 Bidding Terminated: The listing duration timer has reached zero.");
      return;
    }

    setTxLoading(true);
    const auctionDocRef = doc(db, "listings", assetId);
    const bidHistoryCollRef = collection(db, "listings", assetId, "bids");
    
    // Derived target price verification
    const absoluteTargetPrice = (auction?.currentBid || 0) + (auction?.minIncrement || 50);

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(auctionDocRef);
        if (!sfDoc.exists()) throw new Error("Target listing element completely removed.");

        const currentServerBid = Number(sfDoc.data().currentBid) || Number(sfDoc.data().startingPrice) || 0;
        const currentIncrement = Number(sfDoc.data().bidIncrement) || 50.00;
        const freshCalculatedTarget = currentServerBid + currentIncrement;

        if (absoluteTargetPrice < freshCalculatedTarget) {
          throw new Error("OUTBID_STALE_CONTEXT");
        }

        // Write Node 1: Primary update state
        transaction.update(auctionDocRef, {
          currentBid: freshCalculatedTarget,
          lastBidderId: user.uid,
          lastBidderName: user.displayName || user.email || "Anonymous Agent",
          updatedAt: serverTimestamp()
        });

        // Write Node 2: Permanent audit trail record
        const newBidLogRef = doc(bidHistoryCollRef);
        transaction.set(newBidLogRef, {
          bidderId: user.uid,
          bidderName: user.displayName || user.email || "Anonymous Agent",
          amount: freshCalculatedTarget,
          timestamp: serverTimestamp(),
          incidentAnchorXID: assetId,
          legalDeviceDispatchTime: notificationReceivedAt
        });
      });

      alert(`🏆 Locked In! Your high bid of $${absoluteTargetPrice.toLocaleString()} has been authorized.`);
    } catch (err: any) {
      console.error("Mutation failure state:", err);
      if (err.message === "OUTBID_STALE_CONTEXT") {
        alert("🚨 Countered! Someone slipped an intermediate bid in right before you. Price adjusted—counter immediately!");
      } else {
        alert("⚠️ Pipeline Error: Encryption handshake timed out. Please check network.");
      }
    } finally {
      setTxLoading(false);
    }
  };

  // Pre-rendering framework loading layers
  if (loading) return <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center font-mono tracking-wider">SYNCING SYSTEM RADAR MATRIX...</div>;
  if (error || !auction) return <div className="min-h-screen bg-slate-950 text-red-500 flex items-center justify-center font-mono tracking-wider">⚠️ DISCONNECT ERROR: {error || "Invalid dynamic node"}</div>;

  const targetNextBid = auction.currentBid + auction.minIncrement;

  // ==========================================
  // MODULE 4: TACTICAL VIEWPORT RENDERING SHEET
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 pb-24 md:pb-4">
      <div className="w-full max-w-md bg-slate-900 border-2 border-red-500 rounded-2xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.15)] mb-4 md:mb-0">
        
        {/* Radar State Row */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full bg-red-500 ${timeLeft !== "HAMMER DOWN" ? "animate-ping" : ""}`} />
            <h2 className="text-sm font-black tracking-widest text-red-500 uppercase">RADAR INTERCEPT</h2>
          </div>
          <div className={`flex items-center gap-1.5 font-mono text-sm font-bold bg-amber-950/40 px-3 py-1 rounded-full border ${timeLeft === "HAMMER DOWN" ? "text-red-500 border-red-500/30" : "text-amber-400 border-amber-500/30"}`}>
            <FaClock />
            <span>{timeLeft}</span>
          </div>
        </div>

        {/* Dynamic Image FOMO Container */}
        <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group mb-4">
          <img 
            src={auction.assetImageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600"} 
            alt={auction.assetName}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            <div className="max-w-[70%]">
              <p className="text-[9px] font-bold uppercase tracking-widest text-amber-400">Target Asset Frame</p>
              <h3 className="text-sm font-black truncate">{auction.assetName}</h3>
            </div>
            
            {/* Spec Link Anchor */}
            <Link 
              href={`/market/listings/${assetId}`}
              target="_blank"
              className="flex items-center gap-1 bg-slate-900/90 hover:bg-slate-800 text-[10px] font-mono text-slate-300 px-2.5 py-1 rounded border border-slate-700/60 transition-colors shadow-xl"
            >
              <span>SPEC: {assetId.substring(0, 8)}</span>
              <FaExternalLinkAlt className="text-[7px]" />
            </Link>
          </div>
        </div>

        {/* Pricing Viewport */}
        <div className="text-center my-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">Current High Bid</p>
          <p className="text-4xl font-black font-mono text-white mt-0.5">
            ${auction.currentBid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* ⚡ DESKTOP EXCLUSIVE BUTTON LAYER (HIDDEN ON MOBILE VIEWPORTS) */}
        <button 
          onClick={handlePlaceBid}
          disabled={txLoading || timeLeft === "HAMMER DOWN" || auction.status !== "active"}
          className="hidden md:flex w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 font-black text-lg py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(220,38,38,0.35)] disabled:shadow-none active:scale-[0.98] items-center justify-center gap-3"
        >
          <FaGavel className={txLoading ? "animate-spin" : ""} />
          {txLoading ? "LOCKING TRANSACTION..." : timeLeft === "HAMMER DOWN" ? "AUCTION CONCLUDED" : `BID $${targetNextBid.toLocaleString('en-US', { minimumFractionDigits: 2 })} TO BEAT`}
        </button>

        {/* Legal Auditing Disclosures */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex flex-col gap-1 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/40">
          <div className="flex justify-between">
            <span className="flex items-center gap-1"><FaShieldAlt /> RADAR TRACE ID:</span>
            <span className="text-slate-300 uppercase">{assetId}</span>
          </div>
          <div className="flex justify-between">
            <span>ALERT DISPATCH LOG:</span>
            <span className="text-slate-300">{notificationReceivedAt}</span>
          </div>
          <div className="flex justify-between">
            <span>DEVICE INTERACTION:</span>
            <span className="text-emerald-400 font-bold">MUTATION LEVEL SECURE</span>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 📱 THUMB-TARGETED FIXED STICKY FOOTER CONSOLE (MOBILE EXCLUSIVE) */}
      {/* ========================================================= */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 z-50 shadow-[0_-8px_24px_rgba(0,0,0,0.5)] flex flex-col gap-2">
        <button
          onClick={handlePlaceBid}
          disabled={txLoading || timeLeft === "HAMMER DOWN" || auction.status !== "active"}
          className="w-full bg-gradient-to-r from-red-600 to-amber-600 text-white disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 font-black text-base py-4 rounded-xl shadow-[0_4px_16px_rgba(239,68,68,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <FaGavel className={txLoading ? "animate-spin" : ""} />
          {txLoading ? "SIGNING TRANSACTION..." : timeLeft === "HAMMER DOWN" ? "AUCTION CONCLUDED" : `ONE-TAP BID $${targetNextBid.toLocaleString('en-US', { minimumFractionDigits: 2 })} ⚡`}
        </button>
        <div className="text-center text-[10px] font-mono text-slate-500">
          Auto-increment multiplier value tracking active.
        </div>
      </div>

    </div>
  );
}
