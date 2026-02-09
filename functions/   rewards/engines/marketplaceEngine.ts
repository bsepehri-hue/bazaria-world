import { calculateDeliveryRate, calculateRatingAverage } from "../utils";

export const marketplaceEngine = {
  updateOnOrderCompleted(state, order) {
    state.marketplace.itemsSold += 1;

    if (order.deliveredOnTime) {
      state.marketplace.onTimeDeliveryRate = calculateDeliveryRate(
        state.marketplace.itemsSold, 
        state.marketplace.itemsListed
      );
    }
  },

  updateOnRatingReceived(state, rating) {
    state.marketplace.averageRating = calculateRatingAverage(
      state.marketplace.averageRating,
      state.marketplace.ratingCount,
      rating
    );

    state.marketplace.ratingCount += 1;
  },

  updateOnCancellation(state) {
    state.marketplace.cancellationRate += 1;
  }
};
