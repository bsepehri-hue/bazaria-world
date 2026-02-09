export const trustEngine = {
  recompute(state) {
    let score = 100;

    // Penalties
    score -= state.penalties.lateShipment * 5;
    score -= state.penalties.cancellation * 10;
    score -= state.penalties.disputeLoss * 20;
    score -= state.penalties.policyStrike * 30;

    // Marketplace performance
    score += Math.floor(state.marketplace.onTimeDeliveryRate * 10);
    score += Math.floor(state.marketplace.averageRating * 2);

    // Auction behavior
    score -= state.auctions.unpaidWins * 15;
    score -= state.auctions.bidRetractions * 5;

    // Steward accuracy
    score += state.steward.accuracyRate * 5;

    // Clamp
    state.trustScore = Math.max(0, Math.min(100, score));
  }
};
