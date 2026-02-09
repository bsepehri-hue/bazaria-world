import * as functions from "firebase-functions";
import { loadRewardsState } from "../utils/loadRewardsState";
import { saveRewardsState } from "../utils/saveRewardsState";
import { appendHistory } from "../utils/appendHistory";

import { auctionEngine } from "../engines/auctionEngine";
import { trustEngine } from "../engines/trustEngine";
import { tierEngine } from "../engines/tierEngine";
import { eligibilityEngine } from "../engines/eligibilityEngine";

export const onAuctionWon = functions.firestore
  .document("auctions/{auctionId}/wins/{winId}")
  .onCreate(async (snap, context) => {
    const win = snap.data();
    if (!win) return;

    const winnerId = win.userId;
    if (!winnerId) return;

    const state = await loadRewardsState(winnerId);

    auctionEngine.updateOnAuctionWon(state);

    trustEngine.recompute(state);
    tierEngine.recompute(state);
    eligibilityEngine.recompute(state);

    await saveRewardsState(winnerId, state);

    await appendHistory(winnerId, "auction_won", win.winId || context.params.winId);
  });
