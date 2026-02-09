export const tierEngine = {
  recompute(state) {
    const t = state.trustScore;

    if (t >= 95) state.rewardTier = "diamond";
    else if (t >= 80) state.rewardTier = "platinum";
    else if (t >= 60) state.rewardTier = "gold";
    else if (t >= 40) state.rewardTier = "silver";
    else if (t >= 20) state.rewardTier = "bronze";
    else state.rewardTier = "none";

    state.tierProgress = {
      current: state.rewardTier,
      next: this.nextTier(state.rewardTier),
      percent: this.progressPercent(t, state.rewardTier)
    };
  },

  nextTier(current) {
    const order = ["none", "bronze", "silver", "gold", "platinum", "diamond"];
    const idx = order.indexOf(current);
    return order[idx + 1] || "diamond";
  },

  progressPercent(t, tier) {
    const thresholds = {
      none: 20,
      bronze: 40,
      silver: 60,
      gold: 80,
      platinum: 95,
      diamond: 100
    };
    return Math.min(100, Math.floor((t / thresholds[tier]) * 100));
  }
};
