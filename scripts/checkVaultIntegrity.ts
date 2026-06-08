import { db } from "../lib/firebase/client"; // 🚀 Fixed relative path for standard script runner execution
import {
  collection,
  getDocs,
} from "firebase/firestore";

async function checkVaultIntegrity() {
  console.log("🔍 Running Vault Integrity Checker...\n");

  // 1. Load all sellers with vault docs
  const vaultSnap = await getDocs(collection(db, "vault"));
  const sellers = vaultSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // 2. Load all timeline events (sales, refunds, payouts, disputes)
  const timelineSnap = await getDocs(collection(db, "timeline"));
  const events = timelineSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const results: any[] = [];

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

    // Compute expected totals
    const expectedEarned = sales.reduce((sum, s) => sum + (s.amount || 0), 0);
    const expectedRefunded = refunds.reduce((sum, r) => sum + (r.amount || 0), 0);
    const expectedPayouts = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Locked funds = opened - lost - won
    const expectedLocked =
      disputesOpened.reduce((sum, d) => sum + (d.amount || 0), 0) -
      disputesLost.reduce((sum, d) => sum + (d.amount || 0), 0) -
      disputesWon.reduce((sum, d) => sum + (d.amount || 0), 0);

    const expectedAvailable =
      expectedEarned - expectedRefunded - expectedPayouts - expectedLocked;

    // Compare with actual vault doc
    const mismatches = [];

    if (seller.totalEarned !== expectedEarned) {
      mismatches.push({
        field: "totalEarned",
        actual: seller.totalEarned,
        expected: expectedEarned,
      });
    }

    if (seller.totalRefunded !== expectedRefunded) {
      mismatches.push({
        field: "totalRefunded",
        actual: seller.totalRefunded,
        expected: expectedRefunded,
      });
    }

    if (seller.totalPayouts !== expectedPayouts) {
      mismatches.push({
        field: "totalPayouts",
        actual: seller.totalPayouts,
        expected: expectedPayouts,
      });
    }

    if (seller.locked !== expectedLocked) {
      mismatches.push({
        field: "locked",
        actual: seller.locked,
        expected: expectedLocked,
      });
    }

    if (seller.available !== expectedAvailable) {
      mismatches.push({
        field: "available",
        actual: seller.available,
        expected: expectedAvailable,
      });
    }

    results.push({
      sellerId,
      mismatches,
    });
  }

  // Print results
  for (const r of results) {
    console.log(`\nSeller: ${r.sellerId}`);

    if (r.mismatches.length === 0) {
      console.log("  ✅ Vault is consistent");
    } else {
      console.log("  ❌ Vault inconsistencies found:");
      for (const m of r.mismatches) {
        console.log(
          `    - ${m.field}: actual=${m.actual}, expected=${m.expected}`
        );
      }
    }
  }

  console.log("\n🔍 Vault Integrity Check Complete.\n");
}

checkVaultIntegrity();
