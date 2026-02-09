export const onOrderCompleted = functions.firestore
  .document("orders/{orderId}")
  .onUpdate(async (change, context) => {
    const after = change.after.data();
    const before = change.before.data();

    if (before.status === "completed") return;
    if (after.status !== "completed") return;

    const sellerId = after.sellerId;

    const state = await loadRewardsState(sellerId);

    marketplaceEngine.updateOnOrderCompleted(state, after);
    trustEngine.recompute(state);
    tierEngine.recompute(state);
    eligibilityEngine.recompute(state);

    await saveRewardsState(sellerId, state);
    await appendHistory(sellerId, "order_completed", after.orderId);
  });
