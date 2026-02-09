import { RewardsState } from "../state/RewardsState";

export const cooldownEngine = {
  applyBiddingCooldown(state: RewardsState, minutes: number) {
    state.cooldowns.bidding = minutes;
  },

  applySellingCooldown(state: RewardsState, minutes: number) {
    state.cooldowns.selling = minutes;
  },

  applyAccountCooldown(state: RewardsState, minutes: number) {
    state.cooldowns.account = minutes;
  },

  clearAllCooldowns(state: RewardsState) {
    state.cooldowns.bidding = 0;
    state.cooldowns.selling = 0;
    state.cooldowns.account = 0;
  }
};
        return;
    }
  }
};
