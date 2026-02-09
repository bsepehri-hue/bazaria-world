"use client";

import { useRewards } from "@/app/lib/rewards/RewardsContext";

export default function EligibilityBadge() {
  const r = useRewards();
  if (!r) return null;

  const e = r.eligibility;

  const status = e.canBid && e.canSell && e.canParticipate
    ? { label: "Fully Eligible", color: "bg-emerald-600" }
    : e.canParticipate
    ? { label: "Limited Eligibility", color: "bg-amber-500" }
    : { label: "Blocked", color: "bg-red-600" };

  return (
    <div className={`px-3 py-1 rounded-lg text-white font-medium text-sm ${status.color} transition-colors duration-300`}>
      {status.label}
    </div>
  );
}
