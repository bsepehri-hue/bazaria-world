import * as functions from "firebase-functions";
import { loadRewardsState } from "../utils/loadRewardsState";
import { saveRewardsState } from "../utils/saveRewardsState";
import { appendHistory } from "../utils/appendHistory";

import { auctionEngine } from "../engines/auctionEngine";
import { trustEngine } from "../engines/trustEngine";
import { tierEngine } from "../engines/tierEngine";
import { eligibilityEngine } from "../engines/eligibilityEngine";

export const onBidPlaced = functions.firestore
  .document("bids/{bidId}")
  .onCreate(async (snap, context) => {
    const bid = snap.data();
    if (!bid) return;

    const bidderId = bid.userId;
    if (!bidderId) return;

    const state = await loadRewardsState(bidderId);

    auctionEngine.updateOnBidPlaced(state);

    trustEngine.recompute(state);
    tierEngine.recompute(state);
    eligibilityEngine.recompute(state);

    await saveRewardsState(bidderId, state);

    await appendHistory(bidderId, "bid_placed", bid.bidId || context.params.bidId);
  });
