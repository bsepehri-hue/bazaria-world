import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

// ---------------------------------------------------------
// Ensure Vault document exists for a seller
// ---------------------------------------------------------
export async function ensureVault(sellerId: string) {
  const vaultRef = doc(db, "vault", sellerId);
  const snap = await getDoc(vaultRef);

  if (!snap.exists()) {
    await setDoc(vaultRef, {
      available: 0,
      totalEarned: 0,
      totalRefunded: 0,
      totalPayouts: 0,
      locked: 0,
      updatedAt: Date.now(),
    });
  }

  return vaultRef;
}

// ---------------------------------------------------------
// Apply delta updates to Vault
// Example: applyVaultDelta(sellerId, { available: +10, totalEarned: +10 })
// ---------------------------------------------------------
export async function applyVaultDelta(
  sellerId: string,
  fields: Record<string, number>
) {
  const vaultRef = await ensureVault(sellerId);

  const updatePayload: any = { updatedAt: Date.now() };

  for (const key in fields) {
    updatePayload[key] = increment(fields[key]);
  }

  await updateDoc(vaultRef, updatePayload);
}
