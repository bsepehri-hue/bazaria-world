import { loadRewardsState } from "../utils/loadRewardsState";
import { saveRewardsState } from "../utils/saveRewardsState";
import { appendHistory } from "../utils/appendHistory";

import { auctionEngine } from "../engines/auctionEngine";
import { penaltyEngine } from "../engines/penaltyEngine";
import { eligibilityEngine } from "../engines/eligibilityEngine";

export const onUnpaidWin = async (userId: string, winId: string) => {
  const state = await loadRewardsState(userId);

  auctionEngine.updateOnUnpaidWin(state);
  penaltyEngine.applyPolicyStrike(state);
  eligibilityEngine.evaluate(state);

  await saveRewardsState(userId, state);
  await appendHistory(userId, "UNPAID_WIN", winId);
};
