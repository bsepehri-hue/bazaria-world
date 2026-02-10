import { httpsCallable } from "firebase/functions";
import { functions } from "@/app/lib/firebase";

export async function logRewardEventClient({
  userId,
  type,
  message,
  delta = null,
}: {
  userId: string;
  type: string;
  message: string;
  delta?: number | null;
}) {
  const fn = httpsCallable(functions, "logRewardEvent");
  await fn({ userId, type, message, delta });
}
