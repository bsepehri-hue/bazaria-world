"use client";

import { useRewards } from "@/app/lib/rewards/RewardsContext";
import Tooltip from "@/app/components/ui/Tooltip";

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
      <div className="flex items-center">
        <span>{total} Penalties</span>
        <Tooltip text="Penalties come from late shipments, cancellations, disputes, or policy violations.">
          <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold">
            i
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
