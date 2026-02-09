"use client";

import { useRewards } from "@/app/lib/rewards/RewardsContext";

export default function RewardsSummaryCard() {
  const r = useRewards();
  if (!r) return null;

  const tierPct = Math.min(100, Math.round((r.tier.points / r.tier.nextLevelAt) * 100));

  const trustColor =
    r.trust.score >= 80
      ? "text-emerald-600"
      : r.trust.score >= 50
      ? "text-amber-600"
      : "text-red-600";

  const cooldownActive =
    r.cooldowns.account > 0 ||
    r.cooldowns.selling > 0 ||
    r.cooldowns.bidding > 0;

  const penalties =
    r.penalties.lateShipment +
    r.penalties.cancellation +
    r.penalties.disputeLoss +
    r.penalties.policyStrike;

  const eligibility =
    r.eligibility.canBid &&
    r.eligibility.canSell &&
    r.eligibility.canParticipate
      ? "Fully Eligible"
      : r.eligibility.canParticipate
      ? "Limited"
      : "Blocked";

  return (
    <div className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm space-y-6">
      
      {/* Tier */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-gray-700 dark:text-gray-200">Tier {r.tier.level}</span>
          <span className="text-gray-500 dark:text-gray-400">
            {r.tier.points} / {r.tier.nextLevelAt}
          </span>
        </div>
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-600 transition-all duration-500"
            style={{ width: `${tierPct}%` }}
          />
        </div>
      </div>

      {/* Trust */}
      <div className="flex justify-between text-sm font-medium">
        <span className="text-gray-700 dark:text-gray-200">Trust Score</span>
        <span className={trustColor}>{r.trust.score}</span>
      </div>

      {/* Cooldown */}
      {cooldownActive && (
        <div className="text-sm font-medium text-amber-600">
          Cooldown Active
        </div>
      )}

      {/* Penalties */}
      {penalties > 0 && (
        <div className="text-sm font-medium text-red-600">
          {penalties} Penalties
        </div>
      )}

      {/* Eligibility */}
      <div className="text-sm font-semibold">
        {eligibility === "Fully Eligible" && (
          <span className="text-emerald-600">Fully Eligible</span>
        )}
        {eligibility === "Limited" && (
          <span className="text-amber-600">Limited Eligibility</span>
        )}
        {eligibility === "Blocked" && (
          <span className="text-red-600">Blocked</span>
        )}
      </div>
    </div>
  );
}
