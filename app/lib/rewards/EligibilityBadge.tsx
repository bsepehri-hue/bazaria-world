"use client";

import { useRewards } from "@/app/lib/rewards/RewardsContext";
import Tooltip from "@/app/components/ui/Tooltip";

export default function EligibilityBadge() {
  const r = useRewards();
  if (!r) return null;

  const e = r.eligibility;

  const status =
    e.canBid && e.canSell && e.canParticipate
      ? { label: "Fully Eligible", color: "bg-emerald-600" }
      : e.canParticipate
      ? { label: "Limited Eligibility", color: "bg-amber-500" }
      : { label: "Blocked", color: "bg-red-600" };

  return (
    <div className={`px-3 py-1 rounded-lg text-white font-medium text-sm ${status.color} transition-colors duration-300`}>
      <div className="flex items-center">
        <span>{status.label}</span>
        <Tooltip text="Eligibility determines whether you can bid, sell, or participate in the marketplace.">
          <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold">
            i
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
