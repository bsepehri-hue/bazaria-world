import { db } from "../firebase";

export const appendHistory = async (
  userId: string,
  eventType: string,
  referenceId: string
) => {
  const ref = db
    .collection("rewardsHistory")
    .doc(userId)
    .collection("events")
    .doc();

  await ref.set({
    eventType,
    referenceId,
    timestamp: new Date()
  });
};
