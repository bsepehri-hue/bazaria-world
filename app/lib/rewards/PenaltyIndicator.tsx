"use client";

import { useRewards } from "@/app/lib/rewards/RewardsContext";

export default function PenaltyIndicator() {
  const r = useRewards();
  if (!r) return null;

  const p = r.penalties;

  const total =
    p.lateShipment +
    p.cancellation +
    p.disputeLoss +
    p.policyStrike;

  if (total === 0) return null;

  return (
    <div className="px-3 py-1 rounded-lg text-white font-medium text-sm bg-red-600 transition-colors duration-300">
      {total} Penalties
    </div>
  );
}
