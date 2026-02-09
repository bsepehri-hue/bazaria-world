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

  const severity =
    total >= 5 ? "bg-red-600" :
    total >= 3 ? "bg-amber-500" :
    "bg-yellow-400";

  return (
    <div className={`px-3 py-1 rounded-lg text-white font-medium text-sm ${severity}`}>
      {total} Penalties
    </div>
  );
}
