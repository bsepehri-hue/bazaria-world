export interface RewardsState {
  userId: string;

  trustScore: number;
  rewardTier: "none" | "bronze" | "silver" | "gold" | "platinum" | "diamond";

  tierProgress: {
    current: string;
    next: string;
    percent: number;
  };

  eligibility: {
    canSell: boolean;
    canBid: boolean;
    canMessage: boolean;
    canOpenStorefront: boolean;
    canBecomeSteward: boolean;
  };

  penalties: {
    lateShipment: number;
    cancellation: number;
    disputeLoss: number;
    policyStrike: number;
  };

  cooldowns: {
    selling: FirebaseFirestore.Timestamp | null;
    bidding: FirebaseFirestore.Timestamp | null;
    messaging: FirebaseFirestore.Timestamp | null;
  };

  marketplace: {
    itemsListed: number;
    itemsSold: number;
    onTimeDeliveryRate: number;

    averageRating: number;
    ratingCount: number;

    cancellationRate: number;
  };

  storefront: {
    ordersCompleted: number;
    disputes: number;
    repeatCustomers: number;
  };

  auctions: {
    bidsPlaced: number;
    bidsWon: number;
    unpaidWins: number;
    bidRetractions: number;
  };

  referralStats: {
    totalReferred: number;
    activeReferred: number;
    bonusesEarned: number;
  };

  steward: {
    verificationsCompleted: number;
    disputeMediations: number;
    accuracyRate: number;
    bonusesEarned: number;
  };
}
