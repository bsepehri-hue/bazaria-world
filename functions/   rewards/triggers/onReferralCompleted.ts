import * as functions from "firebase-functions";
import { loadRewardsState } from "../utils/loadRewardsState";
import { saveRewardsState } from "../utils/saveRewardsState";
import { appendHistory } from "../utils/appendHistory";

import { referralEngine } from "../engines/referralEngine";
import { trustEngine } from "../engines/trustEngine";
import { tierEngine } from "../engines/tierEngine";
import { eligibilityEngine } from "../engines/eligibilityEngine";

export const onReferralCompleted = functions.firestore
  .document("referrals/{referralId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (!before || !after) return;

    if (before.status === "completed") return;
    if (after.status !== "completed") return;

    const userId = after.referrerId;
    if (!userId) return;

    const state = await loadRewardsState(userId);

    referralEngine.updateOnReferralCompleted(state);

    trustEngine.recompute(state);
    tierEngine.recompute(state);
    eligibilityEngine.recompute(state);

    await saveRewardsState(userId, state);

    await appendHistory(userId, "referral_completed", after.referralId || context.params.referralId);
  });
