import { RewardsState } from "../state/RewardsState";

export const trustEngine = {
  applyPositiveEvent(state: RewardsState, amount: number = 1) {
    state.trust.positiveEvents += amount;
    state.trust.score += amount;
  },

  applyNegativeEvent(state: RewardsState, amount: number = 1) {
    state.trust.negativeEvents += amount;
    state.trust.score -= amount;
  },

  applyDecayStrike(state: RewardsState) {
    state.trust.decayStrikes += 1;
    state.trust.score = Math.max(0, state.trust.score - 1);
  },

  clampScore(state: RewardsState, min: number = 0, max: number = 100) {
    state.trust.score = Math.min(max, Math.max(min, state.trust.score));
  }
};
