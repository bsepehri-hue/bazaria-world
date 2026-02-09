"use client";

import { useRewards } from "@/app/lib/rewards/RewardsContext";
import { useEffect, useState } from "react";

export default function CooldownTimer() {
  const r = useRewards();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!r) return null;

  const { bidding, selling, account } = r.cooldowns;

  const active =
    account > 0
      ? { label: "Account", ms: account }
      : selling > 0
      ? { label: "Selling", ms: selling }
      : bidding > 0
      ? { label: "Bidding", ms: bidding }
      : null;

  if (!active) return null;

  const seconds = Math.max(0, Math.floor(active.ms / 1000));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const formatted = [
    h > 0 ? `${h}h` : null,
    m > 0 ? `${m}m` : null,
    `${s}s`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="px-3 py-1 rounded-lg text-white font-medium text-sm bg-amber-500 transition-colors duration-300">
      {active.label} Cooldown: {formatted}
    </div>
  );
}
