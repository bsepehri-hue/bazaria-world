export const auctionEngine = {
  updateOnBidPlaced(state) {
    state.auctions.bidsPlaced += 1;
  },

  updateOnAuctionWon(state) {
    state.auctions.bidsWon += 1;
  },

  updateOnUnpaidWin(state) {
    state.auctions.unpaidWins += 1;
  },

  updateOnBidRetraction(state) {
    state.auctions.bidRetractions += 1;
  }
};
