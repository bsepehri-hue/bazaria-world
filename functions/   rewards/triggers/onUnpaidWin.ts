import * as functions from "firebase-functions";
import { loadRewardsState } from "../utils/loadRewardsState";
import { saveRewardsState } from "../utils/saveRewardsState";
import { appendHistory } from "../utils/appendHistory";

import { auctionEngine } from "../engines/auctionEngine";
import { penaltyEngine } from "../engines/penaltyEngine";
import { cooldownEngine } from "../engines/cooldownEngine";
import { trustEngine } from "../engines/trustEngine";
import { tierEngine } from "../engines/tierEngine";
import { eligibilityEngine } from "../engines/eligibilityEngine";

export const onUnpaidWin = functions.firestore
  .document("auctions/{auctionId}/unpaid/{recordId}")
  .onCreate(async (snap, context) => {
    const record = snap.data();
    if (!record) return;

    const userId = record.userId;
    if (!userId) return;

    const state = await loadRewardsState(userId);

    auctionEngine.updateOnUnpaidWin(state);

    penaltyEngine.apply(state, "disputeLoss");

    cooldownEngine.apply(state, "bidding", 24);

    trustEngine.recompute(state);
    tierEngine.recompute(state);
    eligibilityEngine.recompute(state);

    await saveRewardsState(userId, state);

    await appendHistory(userId, "unpaid_win", record.recordId || context.params.recordId);
  });
