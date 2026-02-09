import * as admin from "firebase-admin";

export const cooldownEngine = {
  apply(state, type, hours) {
    const end = admin.firestore.Timestamp.fromMillis(
      Date.now() + hours * 60 * 60 * 1000
    );

    switch (type) {
      case "selling":
        state.cooldowns.selling = end;
        break;

      case "bidding":
        state.cooldowns.bidding = end;
        break;

      case "messaging":
        state.cooldowns.messaging = end;
        break;

      default:
        return;
    }
  }
};
