import { RewardsState } from "../state/RewardsState";

export const penaltyEngine = {
  applyLateShipment(state: RewardsState) {
    state.penalties.lateShipment += 1;
  },

  applyCancellation(state: RewardsState) {
    state.penalties.cancellation += 1;
  },

  applyDisputeLoss(state: RewardsState) {
    state.penalties.disputeLoss += 1;
  },

  applyPolicyStrike(state: RewardsState) {
    state.penalties.policyStrike += 1;
  }
};
