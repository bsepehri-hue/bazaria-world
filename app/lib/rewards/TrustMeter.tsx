"use client";

import { useRewards } from "@/app/lib/rewards/RewardsContext";
import Tooltip from "@/app/components/ui/Tooltip";

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
    <div className="w-full space-y-1 max-w-xs">

      {/* Label row with tooltip */}
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
        <div className="flex items-center">
          <span>Trust</span>
          <Tooltip text="Trust increases with good behavior and decreases with disputes, cancellations, or policy issues.">
            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold">
              i
            </span>
          </Tooltip>
        </div>

        <span className="text-gray-700 dark:text-gray-200">{score}</span>
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
