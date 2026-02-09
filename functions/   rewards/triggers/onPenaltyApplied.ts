import { loadRewardsState } from "../utils/loadRewardsState";
import { saveRewardsState } from "../utils/saveRewardsState";
import { appendHistory } from "../utils/appendHistory";

import { penaltyEngine } from "../engines/penaltyEngine";
import { eligibilityEngine } from "../engines/eligibilityEngine";

export const onPenaltyApplied = async (
  userId: string,
  penaltyId: string,
  type: "lateShipment" | "cancellation" | "disputeLoss" | "policyStrike"
) => {
  const state = await loadRewardsState(userId);

  penaltyEngine[`apply${capitalize(type)}`](state);
  eligibilityEngine.evaluate(state);

  await saveRewardsState(userId, state);
  await appendHistory(userId, "PENALTY_APPLIED", penaltyId);
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
