import * as functions from "firebase-functions";
import { loadRewardsState } from "../utils/loadRewardsState";
import { saveRewardsState } from "../utils/saveRewardsState";
import { appendHistory } from "../utils/appendHistory";

import { marketplaceEngine } from "../engines/marketplaceEngine";
import { trustEngine } from "../engines/trustEngine";
import { tierEngine } from "../engines/tierEngine";
import { eligibilityEngine } from "../engines/eligibilityEngine";

export const onRatingReceived = functions.firestore
  .document("ratings/{ratingId}")
  .onCreate(async (snap, context) => {
    const rating = snap.data();
    if (!rating) return;

    const sellerId = rating.sellerId;
    if (!sellerId) return;

    const state = await loadRewardsState(sellerId);

    marketplaceEngine.updateOnRatingReceived(state, rating.value);

    trustEngine.recompute(state);
    tierEngine.recompute(state);
    eligibilityEngine.recompute(state);

    await saveRewardsState(sellerId, state);

    await appendHistory(sellerId, "rating_received", rating.ratingId || context.params.ratingId);
  });
