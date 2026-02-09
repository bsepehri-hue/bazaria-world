"use client";

import { useRewards } from "@/app/lib/rewards/RewardsContext";

export default function TierProgress() {
  const r = useRewards();
  if (!r) return null;

  const { level, points, nextLevelAt } = r.tier;
  const pct = Math.min(100, Math.round((points / nextLevelAt) * 100));

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
        <span>Tier {level}</span>
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
