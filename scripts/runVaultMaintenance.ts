import readline from "readline";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

// ---------------------------------------------------------
// STEP 1 — INTEGRITY CHECK (READ-ONLY)
// ---------------------------------------------------------
async function runIntegrityCheck() {
  console.log("🔍 Running Vault Integrity Check...\n");

  const vaultSnap = await getDocs(collection(db, "vault"));
  const sellers = vaultSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const timelineSnap = await getDocs(collection(db, "timeline"));
  const events = timelineSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const mismatchesBySeller: any = {};

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

    const mismatches: any = {};

    for (const key of Object.keys(expected)) {
      if (seller[key] !== expected[key]) {
        mismatches[key] = {
          actual: seller[key],
          expected: expected[key],
        };
      }
    }

    if (Object.keys(mismatches).length > 0) {
      mismatchesBySeller[sellerId] = mismatches;
    }
  }

  // Print results
  if (Object.keys(mismatchesBySeller).length === 0) {
    console.log("✅ All Vault documents are consistent.\n");
  } else {
    console.log("❌ Vault inconsistencies detected:\n");

    for (const sellerId in mismatchesBySeller) {
      console.log(`Seller ${sellerId}:`);
      const mismatches = mismatchesBySeller[sellerId];

      for (const field in mismatches) {
        const m = mismatches[field];
        console.log(
          `  - ${field}: actual=${m.actual}, expected=${m.expected}`
        );
      }
      console.log("");
    }
  }

  return mismatchesBySeller;
}

// ---------------------------------------------------------
// STEP 2 — AUTO-REPAIR (ONLY IF USER CONFIRMS)
// ---------------------------------------------------------
async function runAutoRepair(mismatchesBySeller: any) {
  console.log("🛠️ Running Vault Auto‑Repair...\n");

  for (const sellerId in mismatchesBySeller) {
    const mismatches = mismatchesBySeller[sellerId];

    const repairPayload: any = { updatedAt: Date.now() };

    for (const field in mismatches) {
      repairPayload[field] = mismatches[field].expected;
    }

    const vaultRef = doc(db, "vault", sellerId);
    await updateDoc(vaultRef, repairPayload);

    console.log(`Seller ${sellerId}: repaired fields:`);
    for (const field in mismatches) {
      console.log(
        `  - ${field}: ${mismatches[field].actual} → ${mismatches[field].expected}`
      );
    }
    console.log("");
  }

  console.log("🛠️ Vault Auto‑Repair Complete.\n");
}

// ---------------------------------------------------------
// MAIN RUNNER — CHECK → PROMPT → REPAIR
// ---------------------------------------------------------
async function main() {
  const mismatches = await runIntegrityCheck();

  if (Object.keys(mismatches).length === 0) {
    console.log("✨ No repairs needed. Exiting.\n");
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Run auto‑repair? (y/n): ", async (answer) => {
    rl.close();

    if (answer.toLowerCase() === "y") {
      await runAutoRepair(mismatches);
    } else {
      console.log("❎ Repair cancelled. No changes made.\n");
    }
  });
}

main();
