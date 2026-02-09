import { loadRewardsState } from "../utils/loadRewardsState";
import { saveRewardsState } from "../utils/saveRewardsState";
import { appendHistory } from "../utils/appendHistory";

import { trustEngine } from "../engines/trustEngine";
import { tierEngine } from "../engines/tierEngine";
import { eligibilityEngine } from "../engines/eligibilityEngine";

export const onReferralCompleted = async (userId: string, referralId: string) => {
  const state = await loadRewardsState(userId);

  trustEngine.applyPositiveEvent(state, 3);
  tierEngine.addPoints(state, 15);
  eligibilityEngine.evaluate(state);

  await saveRewardsState(userId, state);
  await appendHistory(userId, "REFERRAL_COMPLETED", referralId);
};
