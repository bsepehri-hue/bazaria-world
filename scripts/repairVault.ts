import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

async function repairVault() {
  console.log("🛠️ Running Vault Auto‑Repair...\n");

  // Load all vault docs
  const vaultSnap = await getDocs(collection(db, "vault"));
  const sellers = vaultSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Load all timeline events
  const timelineSnap = await getDocs(collection(db, "timeline"));
  const events = timelineSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  for (const seller of sellers) {
    const sellerId = seller.id;

    // Filter events for this seller
    const sales = events.filter(
      (e) => e.sellerId === sellerId && e.type === "sale"
    );
    const refunds = events.filter(
      (e) => e.sellerId === sellerId && e.type === "refund"
    );
    const payouts = events.filter(
      (e) => e.sellerId === sellerId && e.type === "payout"
    );
    const disputesOpened = events.filter(
      (e) => e.sellerId === sellerId && e.label?.startsWith("Dispute opened")
    );
    const disputesLost = events.filter(
      (e) => e.sellerId === sellerId && e.label?.startsWith("Dispute lost")
    );
    const disputesWon = events.filter(
      (e) => e.sellerId === sellerId && e.label?.startsWith("Dispute won")
    );

    // Compute expected values
    const expectedEarned = sales.reduce((sum, s) => sum + (s.amount || 0), 0);
    const expectedRefunded = refunds.reduce((sum, r) => sum + (r.amount || 0), 0);
    const expectedPayouts = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);

    const expectedLocked =
      disputesOpened.reduce((sum, d) => sum + (d.amount || 0), 0) -
      disputesLost.reduce((sum, d) => sum + (d.amount || 0), 0) -
      disputesWon.reduce((sum, d) => sum + (d.amount || 0), 0);

    const expectedAvailable =
      expectedEarned - expectedRefunded - expectedPayouts - expectedLocked;

    // Compare with actual vault doc
    const mismatches: Record<string, { actual: number; expected: number }> = {};

    const fieldsToCheck = [
      "totalEarned",
      "totalRefunded",
      "totalPayouts",
      "locked",
      "available",
    ];

    const expectedValues: any = {
      totalEarned: expectedEarned,
      totalRefunded: expectedRefunded,
      totalPayouts: expectedPayouts,
      locked: expectedLocked,
      available: expectedAvailable,
    };

    for (const field of fieldsToCheck) {
      if (seller[field] !== expectedValues[field]) {
        mismatches[field] = {
          actual: seller[field],
          expected: expectedValues[field],
        };
      }
    }

    if (Object.keys(mismatches).length === 0) {
      console.log(`Seller ${sellerId}: ✅ No repair needed`);
      continue;
    }

    // Build repair payload
    const repairPayload: any = { updatedAt: Date.now() };

    for (const field in mismatches) {
      repairPayload[field] = mismatches[field].expected;
    }

    // Apply repair
    const vaultRef = doc(db, "vault", sellerId);
    await updateDoc(vaultRef, repairPayload);

    console.log(`Seller ${sellerId}: 🛠️ Repaired fields:`);
    for (const field in mismatches) {
      console.log(
        `  - ${field}: ${mismatches[field].actual} → ${mismatches[field].expected}`
      );
    }
  }

  console.log("\n🛠️ Vault Auto‑Repair Complete.\n");
}

repairVault();
