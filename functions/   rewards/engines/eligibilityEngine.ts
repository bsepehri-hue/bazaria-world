import { RewardsState } from "../state/RewardsState";

export const eligibilityEngine = {
  evaluate(state: RewardsState) {
    const hasActiveCooldown =
      state.cooldowns.bidding > 0 ||
      state.cooldowns.selling > 0 ||
      state.cooldowns.account > 0;

    const tooManyPenalties =
      state.penalties.policyStrike >= 3 ||
      state.penalties.disputeLoss >= 5;

    const lowTrust = state.trust.score < 10;

    state.eligibility.canBid = !hasActiveCooldown && !tooManyPenalties && !lowTrust;
    state.eligibility.canSell = !hasActiveCooldown && !tooManyPenalties;
    state.eligibility.canParticipate = !hasActiveCooldown && !tooManyPenalties;
  }
};
