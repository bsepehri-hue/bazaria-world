import { loadRewardsState } from "../utils/loadRewardsState";
import { saveRewardsState } from "../utils/saveRewardsState";
import { appendHistory } from "../utils/appendHistory";

import { auctionEngine } from "../engines/auctionEngine";
import { tierEngine } from "../engines/tierEngine";
import { eligibilityEngine } from "../engines/eligibilityEngine";

export const onAuctionWon = async (userId: string, auctionId: string) => {
  const state = await loadRewardsState(userId);

  auctionEngine.updateOnAuctionWon(state);
  tierEngine.addPoints(state, 10);
  eligibilityEngine.evaluate(state);

  await saveRewardsState(userId, state);
  await appendHistory(userId, "AUCTION_WON", auctionId);
};
