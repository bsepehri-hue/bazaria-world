"use client";

import { useRewards } from "@/app/lib/rewards/RewardsContext";

export default function RewardsHUD() {
  const r = useRewards();
  if (!r) return null;

  const cooldownActive =
    r.cooldowns.bidding > 0 ||
    r.cooldowns.selling > 0 ||
    r.cooldowns.account > 0;

  return (
    <div className="flex items-center gap-4 text-sm">

      {/* Tier */}
      <div className="px-3 py-1 rounded-lg bg-teal-600 text-white font-semibold">
        Tier {r.tier.level}
      </div>

      {/* Trust */}
      <div className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
        Trust {r.trust.score}
      </div>

      {/* Eligibility */}
      <div
        className={`px-3 py-1 rounded-lg font-medium ${
          r.eligibility.canBid
            ? "bg-emerald-600 text-white"
            : "bg-red-600 text-white"
        }`}
      >
        {r.eligibility.canBid ? "Eligible" : "Blocked"}
      </div>

      {/* Cooldowns */}
      {cooldownActive && (
        <div className="px-3 py-1 rounded-lg bg-amber-500 text-white font-medium">
          Cooldown
        </div>
      )}
    </div>
  );
}
