"use client";

import React from "react";
// 🎯 Use this specific pathing to force a clean break from the "ghost" component
import * as DashboardCore from "./RewardsDashboard";

export default function RewardsPage() {
  // We call the named export specifically from the module
  return <DashboardCore.RewardsDashboard />;
}
