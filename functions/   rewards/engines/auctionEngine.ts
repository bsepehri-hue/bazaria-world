import { RewardsState } from "../state/RewardsState";

export const auctionEngine = {
  updateOnBidPlaced(state: RewardsState) {
    state.auctions.bidsPlaced += 1;
  },

  updateOnAuctionWon(state: RewardsState) {
    state.auctions.bidsWon += 1;
  },

  updateOnUnpaidWin(state: RewardsState) {
    state.auctions.unpaidWins += 1;
  },

  updateOnBidRetracted(state: RewardsState) {
    state.auctions.bidRetractions += 1;
  }
};
