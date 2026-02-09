import * as functions from "firebase-functions";
import { loadRewardsState } from "../utils/loadRewardsState";
import { saveRewardsState } from "../utils/saveRewardsState";
import { appendHistory } from "../utils/appendHistory";

import { storefrontEngine } from "../engines/storefrontEngine";
import { trustEngine } from "../engines/trustEngine";
import { tierEngine } from "../engines/tierEngine";
import { eligibilityEngine } from "../engines/eligibilityEngine";

export const onDisputeResolved = functions.firestore
  .document("disputes/{disputeId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (!before || !after) return;

    if (before.status === "resolved") return;
    if (after.status !== "resolved") return;

    const sellerId = after.sellerId;
    if (!sellerId) return;

    const state = await loadRewardsState(sellerId);

    storefrontEngine.updateOnDisputeResolved(state, after.outcome);

    trustEngine.recompute(state);
    tierEngine.recompute(state);
    eligibilityEngine.recompute(state);

    await saveRewardsState(sellerId, state);

    await appendHistory(sellerId, "dispute_resolved", after.disputeId || context.params.disputeId);
  });
