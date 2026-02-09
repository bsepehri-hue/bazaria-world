import * as functions from "firebase-functions";

import { onBidPlaced } from "./rewards/triggers/onBidPlaced";
import { onAuctionWon } from "./rewards/triggers/onAuctionWon";
import { onUnpaidWin } from "./rewards/triggers/onUnpaidWin";
import { onOrderCompleted } from "./rewards/triggers/onOrderCompleted";
import { onRatingReceived } from "./rewards/triggers/onRatingReceived";
import { onPenaltyApplied } from "./rewards/triggers/onPenaltyApplied";
import { onReferralCompleted } from "./rewards/triggers/onReferralCompleted";
import { onDisputeResolved } from "./rewards/triggers/onDisputeResolved";

export const rewards_onBidPlaced = functions.https.onCall(
  async (data, context) => {
    const userId = context.auth?.uid;
    if (!userId) throw new functions.https.HttpsError("unauthenticated", "User not authenticated");
    return onBidPlaced(userId, data.bidId);
  }
);

export const rewards_onAuctionWon = functions.https.onCall(
  async (data, context) => {
    const userId = context.auth?.uid;
    if (!userId) throw new functions.https.HttpsError("unauthenticated", "User not authenticated");
    return onAuctionWon(userId, data.auctionId);
  }
);

export const rewards_onUnpaidWin = functions.https.onCall(
  async (data, context) => {
    const userId = context.auth?.uid;
    if (!userId) throw new functions.https.HttpsError("unauthenticated", "User not authenticated");
    return onUnpaidWin(userId, data.winId);
  }
);

export const rewards_onOrderCompleted = functions.https.onCall(
  async (data, context) => {
    const userId = context.auth?.uid;
    if (!userId) throw new functions.https.HttpsError("unauthenticated", "User not authenticated");
    return onOrderCompleted(userId, data.orderId);
  }
);

export const rewards_onRatingReceived = functions.https.onCall(
  async (data, context) => {
    const userId = context.auth?.uid;
    if (!userId) throw new functions.https.HttpsError("unauthenticated", "User not authenticated");
    return onRatingReceived(userId, data.ratingId, data.score);
  }
);

export const rewards_onPenaltyApplied = functions.https.onCall(
  async (data, context) => {
    const userId = context.auth?.uid;
    if (!userId) throw new functions.https.HttpsError("unauthenticated", "User not authenticated");
    return onPenaltyApplied(userId, data.penaltyId, data.type);
  }
);

export const rewards_onReferralCompleted = functions.https.onCall(
  async (data, context) => {
    const userId = context.auth?.uid;
    if (!userId) throw new functions.https.HttpsError("unauthenticated", "User not authenticated");
    return onReferralCompleted(userId, data.referralId);
  }
);

export const rewards_onDisputeResolved = functions.https.onCall(
  async (data, context) => {
    const userId = context.auth?.uid;
    if (!userId) throw new functions.https.HttpsError("unauthenticated", "User not authenticated");
    return onDisputeResolved(userId, data.disputeId, data.outcome);
  }
);
