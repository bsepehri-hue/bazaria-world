export const eligibilityEngine = {
  recompute(state) {
    const t = state.trustScore;
    const cd = state.cooldowns;

    const now = Date.now();

    const sellingCooldown = cd.selling && cd.selling.toMillis() > now;
    const biddingCooldown = cd.bidding && cd.bidding.toMillis() > now;
    const messagingCooldown = cd.messaging && cd.messaging.toMillis() > now;

    state.eligibility = {
      canSell: t >= 20 && !sellingCooldown,
      canBid: t >= 10 && !biddingCooldown,
      canMessage: t >= 5 && !messagingCooldown,
      canOpenStorefront: t >= 40,
      canBecomeSteward: t >= 80
    };
  }
};
