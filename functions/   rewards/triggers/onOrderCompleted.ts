import { loadRewardsState } from "../utils/loadRewardsState";
import { saveRewardsState } from "../utils/saveRewardsState";
import { appendHistory } from "../utils/appendHistory";

import { trustEngine } from "../engines/trustEngine";
import { tierEngine } from "../engines/tierEngine";
import { eligibilityEngine } from "../engines/eligibilityEngine";

export const onOrderCompleted = async (userId: string, orderId: string) => {
  const state = await loadRewardsState(userId);

  trustEngine.applyPositiveEvent(state, 2);
  tierEngine.addPoints(state, 5);
  eligibilityEngine.evaluate(state);

  await saveRewardsState(userId, state);
  await appendHistory(userId, "ORDER_COMPLETED", orderId);
};
