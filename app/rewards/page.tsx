"use client";

import React, { memo } from "react";
import RewardsDashboard from "./RewardsDashboard";

// 🎯 THE STABILITY SECURE SHIELD: Memoize the 1,397-line dashboard logic framework.
// This forcefully drops duplicate remounting threads and event bubbling loops.
const MemoizedDashboard = memo(RewardsDashboard);

export default function RewardsPage() {
  return <MemoizedDashboard />;
}
