import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

async function dailyVaultCheck() {
  console.log("🌙 Nightly Vault Integrity Check\n");

  const vaultSnap = await getDocs(collection(db, "vault"));
  const sellers = vaultSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const timelineSnap = await getDocs(collection(db, "timeline"));
  const events = timelineSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  let driftCount = 0;

  for (const seller of sellers) {
    const sellerId = seller.id;

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

    const expectedEarned = sales.reduce((s, e) => s + (e.amount || 0), 0);
    const expectedRefunded = refunds.reduce((s, e) => s + (e.amount || 0), 0);
    const expectedPayouts = payouts.reduce((s, e) => s + (e.amount || 0), 0);

    const expectedLocked =
      disputesOpened.reduce((s, e) => s + (e.amount || 0), 0) -
      disputesLost.reduce((s, e) => s + (e.amount || 0), 0) -
      disputesWon.reduce((s, e) => s + (e.amount || 0), 0);

    const expectedAvailable =
      expectedEarned - expectedRefunded - expectedPayouts - expectedLocked;

    const expected = {
      totalEarned: expectedEarned,
      totalRefunded: expectedRefunded,
      totalPayouts: expectedPayouts,
      locked: expectedLocked,
      available: expectedAvailable,
    };

    const mismatches = [];

    for (const key of Object.keys(expected)) {
      if (seller[key] !== expected[key]) {
        mismatches.push({
          field: key,
          actual: seller[key],
          expected: expected[key],
        });
      }
    }

    if (mismatches.length > 0) {
      driftCount++;
      console.log(`❌ Drift detected for seller ${sellerId}:`);
      mismatches.forEach((m) => {
        console.log(
          `   - ${m.field}: actual=${m.actual}, expected=${m.expected}`
        );
      });
      console.log("");
    }
  }

  if (driftCount === 0) {
    console.log("✅ No drift detected. Vault is clean.\n");
  } else {
    console.log(`⚠️ ${driftCount} seller(s) have drift.\n`);
    console.log("Run:  node scripts/runVaultMaintenance.ts  to repair.\n");
  }

  console.log("🌙 Nightly Vault Check Complete.\n");
}

dailyVaultCheck();
