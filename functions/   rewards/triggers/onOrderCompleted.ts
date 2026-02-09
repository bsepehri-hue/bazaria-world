import * as functions from "firebase-functions";
import { loadRewardsState } from "../utils/loadRewardsState";
import { saveRewardsState } from "../utils/saveRewardsState";
import { appendHistory } from "../utils/appendHistory";

import { marketplaceEngine } from "../engines/marketplaceEngine";
import { trustEngine } from "../engines/trustEngine";
import { tierEngine } from "../engines/tierEngine";
import { eligibilityEngine } from "../engines/eligibilityEngine";

export const onOrderCompleted = functions.firestore
  .document("orders/{orderId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (!before || !after) return;

    if (before.status === "completed") return;
    if (after.status !== "completed") return;

    const sellerId = after.sellerId;
    if (!sellerId) return;

    const state = await loadRewardsState(sellerId);

    marketplaceEngine.updateOnOrderCompleted(state, after);

    trustEngine.recompute(state);
    tierEngine.recompute(state);
    eligibilityEngine.recompute(state);

    await saveRewardsState(sellerId, state);

    await appendHistory(sellerId, "order_completed", after.orderId);
  });
