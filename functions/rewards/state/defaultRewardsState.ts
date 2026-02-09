export const defaultRewardsState = (userId: string): RewardsState => ({
  userId,

  trustScore: 100,
  rewardTier: "none",

  tierProgress: {
    current: "none",
    next: "bronze",
    percent: 0
  },

  eligibility: {
    canSell: false,
    canBid: false,
    canMessage: false,
    canOpenStorefront: false,
    canBecomeSteward: false
  },

  penalties: {
    lateShipment: 0,
    cancellation: 0,
    disputeLoss: 0,
    policyStrike: 0
  },

  cooldowns: {
    selling: null,
    bidding: null,
    messaging: null
  },

  marketplace: {
    itemsListed: 0,
    itemsSold: 0,
    onTimeDeliveryRate: 1,

    averageRating: 0,
    ratingCount: 0,

    cancellationRate: 0
  },

  storefront: {
    ordersCompleted: 0,
    disputes: 0,
    repeatCustomers: 0
  },

  auctions: {
    bidsPlaced: 0,
    bidsWon: 0,
    unpaidWins: 0,
    bidRetractions: 0
  },

  referralStats: {
    totalReferred: 0,
    activeReferred: 0,
    bonusesEarned: 0
  },

  steward: {
    verificationsCompleted: 0,
    disputeMediations: 0,
    accuracyRate: 0,
    bonusesEarned: 0
  }
});
