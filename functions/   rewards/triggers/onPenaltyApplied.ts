import * as functions from "firebase-functions";
import { loadRewardsState } from "../utils/loadRewardsState";
import { saveRewardsState } from "../utils/saveRewardsState";
import { appendHistory } from "../utils/appendHistory";

import { penaltyEngine } from "../engines/penaltyEngine";
import { cooldownEngine } from "../engines/cooldownEngine";
import { trustEngine } from "../engines/trustEngine";
import { tierEngine } from "../engines/tierEngine";
import { eligibilityEngine } from "../engines/eligibilityEngine";

export const onPenaltyApplied = functions.firestore
  .document("penalties/{penaltyId}")
  .onCreate(async (snap, context) => {
    const penalty = snap.data();
    if (!penalty) return;

    const userId = penalty.userId;
    if (!userId) return;

    const state = await loadRewardsState(userId);

    penaltyEngine.apply(state, penalty.type);

    if (penalty.cooldownHours) {
      cooldownEngine.apply(state, penalty.cooldownType, penalty.cooldownHours);
    }

    trustEngine.recompute(state);
    tierEngine.recompute(state);
    eligibilityEngine.recompute(state);

    await saveRewardsState(userId, state);

    await appendHistory(userId, "penalty_applied", penalty.penaltyId || context.params.penaltyId);
  });
