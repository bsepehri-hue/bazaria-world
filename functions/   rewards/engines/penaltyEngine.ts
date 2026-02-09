export const penaltyEngine = {
  apply(state, type) {
    switch (type) {
      case "lateShipment":
        state.penalties.lateShipment += 1;
        break;

      case "cancellation":
        state.penalties.cancellation += 1;
        break;

      case "disputeLoss":
        state.penalties.disputeLoss += 1;
        break;

      case "policyStrike":
        state.penalties.policyStrike += 1;
        break;

      default:
        return;
    }
  }
};
