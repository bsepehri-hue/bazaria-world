# Ensure the hooks directory exists first
New-Item -ItemType Directory -Force -Path "hooks"

$hookCode = @'
"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Your local established firebase initialization path
import { useAccount } from "wagmi";

export interface ActiveBidData {
  auctionId: string;
  assetName: string;
  assetCategory: string;
  userLastBidAmount: number;
  currentHighestBidUSD: number;
  isCurrentHighestBidder: boolean;
  endsAt: string; // ISO String or Timestamp representation
}

export function useUserBids(currentUserId?: string) {
  const [activeBids, setActiveBids] = useState<ActiveBidData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { address: cryptoAddress } = useAccount();

  useEffect(() => {
    // If the user isn't authenticated via Web2 or Web3 yet, standby
    if (!currentUserId && !cryptoAddress) {
      setActiveBids([]);
      setIsLoading(false);
      return;
    }

    // Reference your main active auctions collection
    const auctionsRef = collection(db, "auctions");

    // Live query: Track any auction currently active where the user is involved
    // Note: Adjust the where clause fields to match your exact Firestore scheme (e.g., tracking a bidder history array)
    const q = query(
      auctionsRef,
      where("status", "==", "active")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bidsArray: ActiveBidData[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const bidderHistory = data.bidderHistory || [];
        
        // Check if user is involved via their Firebase UUID or their connected MetaMask Wallet Address
        const hasBidWeb2 = currentUserId && bidderHistory.includes(currentUserId);
        const hasBidWeb3 = cryptoAddress && bidderHistory.map((a: string) => a.toLowerCase()).includes(cryptoAddress.toLowerCase());
        const isHighestBidder = 
          (currentUserId && data.highestBidderId === currentUserId) ||
          (cryptoAddress && data.highestBidderAddress?.toLowerCase() === cryptoAddress.toLowerCase());

        if (hasBidWeb2 || hasBidWeb3 || isHighestBidder) {
          // Calculate what this specific user's top historic bid was inside this room
          const userBids = data.bids?.filter((b: any) => 
            b.userId === currentUserId || b.walletAddress?.toLowerCase() === cryptoAddress?.toLowerCase()
          ) || [];
          const userMaxBid = userBids.reduce((max: number, b: any) => b.amount > max ? b.amount : max, 0);

          bidsArray.push({
            auctionId: doc.id,
            assetName: data.title || "Premium Asset Assets",
            assetCategory: data.category || "General",
            userLastBidAmount: userMaxBid || data.startingPrice || 0,
            currentHighestBidUSD: data.currentPrice || data.startingPrice || 0,
            isCurrentHighestBidder: !!isHighestBidder,
            endsAt: data.endTime, // Make sure your data populated format handles countdown strings cleanly
          });
        }
      });

      // Sort by absolute urgency: shorter time remaining floats straight to the top of the phone screen
      bidsArray.sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime());

      setActiveBids(bidsArray);
      setIsLoading(false);
    }, (error) => {
      console.error("Error streaming active bid radar frames:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserId, cryptoAddress]);

  return { activeBids, isLoading };
}
'@
Set-Content -Path "hooks\useUserBids.ts" -Value $hookCode
