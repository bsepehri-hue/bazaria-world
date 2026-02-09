"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

type RewardsState = {
  auctions: {
    bidsPlaced: number;
    bidsWon: number;
    unpaidWins: number;
    bidRetractions: number;
  };
  penalties: {
    lateShipment: number;
    cancellation: number;
    disputeLoss: number;
    policyStrike: number;
  };
  cooldowns: {
    bidding: number;
    selling: number;
    account: number;
  };
  trust: {
    score: number;
    positiveEvents: number;
    negativeEvents: number;
    decayStrikes: number;
  };
  tier: {
    level: number;
    points: number;
    nextLevelAt: number;
  };
  eligibility: {
    canBid: boolean;
    canSell: boolean;
    canParticipate: boolean;
  };
};

const RewardsContext = createContext<RewardsState | null>(null);

export function RewardsProvider({ userId, children }: { userId: string; children: React.ReactNode }) {
  const [state, setState] = useState<RewardsState | null>(null);

  useEffect(() => {
    if (!userId) return;

    const ref = doc(db, "rewards", userId);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setState(snap.data() as RewardsState);
    });

    return () => unsub();
  }, [userId]);

  return <RewardsContext.Provider value={state}>{children}</RewardsContext.Provider>;
}

export function useRewards() {
  return useContext(RewardsContext);
}
