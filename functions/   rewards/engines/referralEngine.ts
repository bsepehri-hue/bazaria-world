export const referralEngine = {
  updateOnReferralCompleted(state) {
    state.referralStats.totalReferred += 1;
  },

  updateOnReferralActivated(state) {
    state.referralStats.activeReferred += 1;
    state.referralStats.bonusesEarned += 10;
  }
};
