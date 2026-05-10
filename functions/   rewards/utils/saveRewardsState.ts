import { db } from "../firebase";
import { RewardsState } from "../state/RewardsState";

export const saveRewardsState = async (userId: string, state: RewardsState) => {
  const ref = db.collection("rewardsState").doc(userId);
  await ref.set(state, { merge: true });
};
