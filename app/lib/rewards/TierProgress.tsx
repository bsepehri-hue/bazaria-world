"use client";

import { useRewards } from "@/app/lib/rewards/RewardsContext";
import Tooltip from "@/app/components/ui/Tooltip";

export default function TierProgress() {
  const r = useRewards();
  if (!r) return null;

  const { level, points, nextLevelAt } = r.tier;
  const pct = Math.min(100, Math.round((points / nextLevelAt) * 100));

  return (
    <div className="w-full space-y-1">

      {/* Label row with tooltip */}
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
        <div className="flex items-center">
          <span>Tier {level}</span>
          <Tooltip text="Earn points by completing actions. Reach the next threshold to level up.">
            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold">
              i
            </span>
          </Tooltip>
        </div>

        <span>{points} / {nextLevelAt}</span>
      </div>

      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-600 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
