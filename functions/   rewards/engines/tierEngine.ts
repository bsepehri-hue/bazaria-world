import { RewardsState } from "../state/RewardsState";

export const tierEngine = {
  addPoints(state: RewardsState, amount: number) {
    state.tier.points += amount;
    this.checkForPromotion(state);
  },

  checkForPromotion(state: RewardsState) {
    while (state.tier.points >= state.tier.nextLevelAt) {
      state.tier.level += 1;
      state.tier.points -= state.tier.nextLevelAt;
      state.tier.nextLevelAt = this.calculateNextThreshold(state.tier.level);
    }
  },

  calculateNextThreshold(level: number): number {
    return 100 + level * 50;
  }
};
