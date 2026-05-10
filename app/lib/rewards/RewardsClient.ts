import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase"; // your initialized client-side Firebase

export class RewardsClient {
  static bidPlaced(bidId: string) {
    return httpsCallable(functions, "rewards_onBidPlaced")({ bidId });
  }

  static auctionWon(auctionId: string) {
    return httpsCallable(functions, "rewards_onAuctionWon")({ auctionId });
  }

  static unpaidWin(winId: string) {
    return httpsCallable(functions, "rewards_onUnpaidWin")({ winId });
  }

  static orderCompleted(orderId: string) {
    return httpsCallable(functions, "rewards_onOrderCompleted")({ orderId });
  }

  static ratingReceived(ratingId: string, score: number) {
    return httpsCallable(functions, "rewards_onRatingReceived")({
      ratingId,
      score
    });
  }

  static penaltyApplied(penaltyId: string, type: string) {
    return httpsCallable(functions, "rewards_onPenaltyApplied")({
      penaltyId,
      type
    });
  }

  static referralCompleted(referralId: string) {
    return httpsCallable(functions, "rewards_onReferralCompleted")({
      referralId
    });
  }

  static disputeResolved(disputeId: string, outcome: "win" | "loss") {
    return httpsCallable(functions, "rewards_onDisputeResolved")({
      disputeId,
      outcome
    });
  }
}
