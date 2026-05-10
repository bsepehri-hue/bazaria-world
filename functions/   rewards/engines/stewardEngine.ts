export const stewardEngine = {
  updateVerification(state) {
    state.steward.verificationsCompleted += 1;
  },

  updateDisputeMediation(state, accurate) {
    state.steward.disputeMediations += 1;

    if (accurate) {
      state.steward.accuracyRate = 
        (state.steward.accuracyRate * (state.steward.disputeMediations - 1) + 1) /
        state.steward.disputeMediations;
    }
  },

  addBonus(state, amount) {
    state.steward.bonusesEarned += amount;
  }
};
