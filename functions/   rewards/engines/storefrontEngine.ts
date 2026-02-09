export const storefrontEngine = {
  updateOnOrderCompleted(state) {
    state.storefront.ordersCompleted += 1;
  },

  updateOnDisputeResolved(state, outcome) {
    if (outcome === "loss") {
      state.storefront.disputes += 1;
    }
  },

  updateRepeatCustomer(state) {
    state.storefront.repeatCustomers += 1;
  }
};
