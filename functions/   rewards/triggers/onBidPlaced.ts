import { loadRewardsState } from "../utils/loadRewardsState";
import { saveRewardsState } from "../utils/saveRewardsState";
import { appendHistory } from "../utils/appendHistory";

import { auctionEngine } from "../engines/auctionEngine";
import { eligibilityEngine } from "../engines/eligibilityEngine";

export const onBidPlaced = async (userId: string, bidId: string) => {
  const state = await loadRewardsState(userId);

  auctionEngine.updateOnBidPlaced(state);
  eligibilityEngine.evaluate(state);

  await saveRewardsState(userId, state);
  await appendHistory(userId, "BID_PLACED", bidId);
};
