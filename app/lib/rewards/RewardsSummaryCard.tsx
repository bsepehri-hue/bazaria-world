"use client";

import { useRewards } from "@/app/lib/rewards/RewardsContext";
import Tooltip from "@/app/components/ui/Tooltip";

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
      ? { label: "Fully Eligible", color: "text-emerald-600" }
      : r.eligibility.canParticipate
      ? { label: "Limited Eligibility", color: "text-amber-600" }
      : { label: "Blocked", color: "text-red-600" };

  return (
    <div className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm space-y-6">

      {/* Tier */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-200">
          <div className="flex items-center">
            <span>Tier {r.tier.level}</span>
            <Tooltip text="Earn points by completing actions. Reach the next threshold to level up.">
              <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold">
                i
              </span>
            </Tooltip>
          </div>

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
        <div className="flex items-center text-gray-700 dark:text-gray-200">
          <span>Trust Score</span>
          <Tooltip text="Trust increases with good behavior and decreases with disputes, cancellations, or policy issues.">
            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold">
              i
            </span>
          </Tooltip>
        </div>

        <span className={trustColor}>{r.trust.score}</span>
      </div>

      {/* Cooldown */}
      {cooldownActive && (
        <div className="flex items-center text-sm font-medium text-amber-600">
          <span>Cooldown Active</span>
          <Tooltip text="Cooldowns prevent rapid actions after certain events. They clear automatically.">
            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold">
              i
            </span>
          </Tooltip>
        </div>
      )}

      {/* Penalties */}
      {penalties > 0 && (
        <div className="flex items-center text-sm font-medium text-red-600">
          <span>{penalties} Penalties</span>
          <Tooltip text="Penalties come from late shipments, cancellations, disputes, or policy violations.">
            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold">
              i
            </span>
          </Tooltip>
        </div>
      )}

      {/* Eligibility */}
      <div className={`flex items-center text-sm font-semibold ${eligibility.color}`}>
        <span>{eligibility.label}</span>
        <Tooltip text="Eligibility determines whether you can bid, sell, or participate in the marketplace.">
          <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold">
            i
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
