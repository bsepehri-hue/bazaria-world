import { db } from "../firebase";
import { RewardsState } from "../state/RewardsState";
import { defaultRewardsState } from "../state/defaultRewardsState";

export const loadRewardsState = async (userId: string): Promise<RewardsState> => {
  const ref = db.collection("rewardsState").doc(userId);
  const snap = await ref.get();

  if (!snap.exists) {
    const fresh = defaultRewardsState(userId);
    await ref.set(fresh);
    return fresh;
  }

  const data = snap.data() as Partial<RewardsState>;
  const merged = { ...defaultRewardsState(userId), ...data };

  return merged;
};
