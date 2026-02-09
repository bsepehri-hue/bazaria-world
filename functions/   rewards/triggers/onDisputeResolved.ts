import { loadRewardsState } from "../utils/loadRewardsState";
import { saveRewardsState } from "../utils/saveRewardsState";
import { appendHistory } from "../utils/appendHistory";

import { trustEngine } from "../engines/trustEngine";
import { eligibilityEngine } from "../engines/eligibilityEngine";

export const onDisputeResolved = async (
  userId: string,
  disputeId: string,
  outcome: "win" | "loss"
) => {
  const state = await loadRewardsState(userId);

  if (outcome === "win") trustEngine.applyPositiveEvent(state, 2);
  else trustEngine.applyNegativeEvent(state, 2);

  eligibilityEngine.evaluate(state);

  await saveRewardsState(userId, state);
  await appendHistory(userId, "DISPUTE_RESOLVED", disputeId);
};
