import { loadRewardsState } from "../utils/loadRewardsState";
import { saveRewardsState } from "../utils/saveRewardsState";
import { appendHistory } from "../utils/appendHistory";

import { trustEngine } from "../engines/trustEngine";
import { eligibilityEngine } from "../engines/eligibilityEngine";

export const onRatingReceived = async (
  userId: string,
  ratingId: string,
  score: number
) => {
  const state = await loadRewardsState(userId);

  if (score >= 4) trustEngine.applyPositiveEvent(state);
  else trustEngine.applyNegativeEvent(state);

  eligibilityEngine.evaluate(state);

  await saveRewardsState(userId, state);
  await appendHistory(userId, "RATING_RECEIVED", ratingId);
};
