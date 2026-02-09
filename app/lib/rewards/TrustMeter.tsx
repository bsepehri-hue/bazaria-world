"use client";

import { useRewards } from "@/app/lib/rewards/RewardsContext";

export default function TrustMeter() {
  const r = useRewards();
  if (!r) return null;

  const score = r.trust.score;

  const color =
    score >= 80
      ? "bg-emerald-600"
      : score >= 50
      ? "bg-amber-500"
      : "bg-red-600";

  return (
    <div className="flex flex-col gap-1 w-full max-w-xs">
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
        <span>Trust</span>
        <span>{score}</span>
      </div>

      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
