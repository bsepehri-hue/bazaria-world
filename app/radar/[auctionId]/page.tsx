"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase/client";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

interface AuctionData {
  assetName: string;
  assetImageUrl: string;
  currentBid: number;
  minIncrement: number;
  endTime: string;
  status: string;
}

export default function RadarBiddingPage({ params, searchParams }: { params: { auctionId: string }; searchParams: any }) {
  const assetId = params.auctionId; // Your XID target anchor

  // 🏛️ Unified Hydration States
  const [auction, setAuction] = useState<AuctionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("00:00");

  useEffect(() => {
    if (!assetId) {
      setError("Missing asset tracking signature identifier.");
      setLoading(false);
      return;
    }

    console.log(`📡 Mount triggered. Initializing live tracking loops for: ${assetId}`);

    // REFERENCE DOC NODE
    const auctionDocRef = doc(db, "listings", assetId);

    // ==========================================
    // PHASE 1 & 2: LIVE STREAM DATA HOOK
    // ==========================================
    const unsubscribe = onSnapshot(
      auctionDocRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          console.error(`❌ Audit Check Failed: ${assetId} not found in listing matrix.`);
          setError("Asset listing context could not be verified.");
          setLoading(false);
          return;
        }

        const data = snapshot.data();
        
        // Hydrate state dynamically with fallback constraints
        setAuction({
          assetName: data.title || "Unknown Listing Asset",
          assetImageUrl: data.imageUrl || data.media?.[0] || "",
          currentBid: Number(data.currentBid) || Number(data.startingPrice) || 0,
          minIncrement: Number(data.bidIncrement) || 50.00,
          endTime: data.endTime?.seconds ? new Date(data.endTime.seconds * 1000).toISOString() : data.endTime || "",
          status: data.status || "active",
        });
        
        setLoading(false);
      },
      (err) => {
        console.error("Firestore stream intercept fault:", err);
        setError("Secure server link interruption.");
        setLoading(false);
      }
    );

    // Global cleanup listener array to teardown listeners when leaving the page
    return () => {
      console.log(`🔌 Dismounting radar intercept frame for: ${assetId}`);
      unsubscribe();
    };
  }, [assetId]);

  // ==========================================
  // PHASE 3: IMMUTABLE COUNTDOWN CLOCK ENGINE
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
      
      setTimeLeft(
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    calculateTime(); // Immediate execution on layout mount
    const intervalId = setInterval(calculateTime, 1000);

    return () => clearInterval(intervalId);
  }, [auction?.endTime]);

  // Handle standard Next.js Loading/Error conditions gracefully
  if (loading) return <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center font-mono">SYNCING RADAR SECTOR DATA...</div>;
  if (error || !auction) return <div className="min-h-screen bg-slate-950 text-red-500 flex items-center justify-center font-mono">⚠️ ERROR: {error || "Invalid Frame Anchor"}</div>;

  // Derive target pricing directly from the live Firestore hook instance
  const targetNextBid = auction.currentBid + auction.minIncrement;

  return (
    <div>
      {/* Paste the layout UI code block here, using:
          - auction.assetName 
          - auction.assetImageUrl 
          - auction.currentBid 
          - targetNextBid 
          - timeLeft */}
    </div>
  );
}
