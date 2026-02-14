"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

export function VaultAdminPanel() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [repairing, setRepairing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

const vaultSnap = await getDocs(collection(db, "vault"));
const timelineSnap = await getDocs(collection(db, "timeline"));

type VaultDoc = {
  id: string;
  sellerId?: string;
  balance?: number;
  totalSales?: number;
  totalRefunds?: number;
  totalPayouts?: number;
  [key: string]: any;
};

const vaultDocs: VaultDoc[] = vaultSnap.docs.map((d) => ({
  id: d.id,
  ...(d.data() as any),
}));

type TimelineEvent = {
  id: string;
  sellerId?: string;
  type?: string;
  amount?: number;
  timestamp?: number;
  label?: string;
  [key: string]: any;
};

const events: TimelineEvent[] = timelineSnap.docs.map((d) => ({
  id: d.id,
  ...(d.data() as any),
}));


    const results: any[] = [];

    for (const seller of vaultDocs) {
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

      const expected: { [key: string]: number } = {
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

      results.push({
        sellerId,
        vault: seller,
        expected,
        mismatches,
      });
    }

    setRows(results);
    setLoading(false);
  }

  async function repairSeller(sellerId: string, mismatches: any) {
    setRepairing(true);

    const repairPayload: any = { updatedAt: Date.now() };
    for (const field in mismatches) {
      repairPayload[field] = mismatches[field].expected;
    }

    await updateDoc(doc(db, "vault", sellerId), repairPayload);
    await loadData();

    setRepairing(false);
  }

  async function repairAll() {
    setRepairing(true);

    for (const row of rows) {
      if (Object.keys(row.mismatches).length > 0) {
        const repairPayload: any = { updatedAt: Date.now() };
        for (const field in row.mismatches) {
          repairPayload[field] = row.mismatches[field].expected;
        }
        await updateDoc(doc(db, "vault", row.sellerId), repairPayload);
      }
    }

    await loadData();
    setRepairing(false);
  }

  if (loading) return <div className="p-6">Loading Vault…</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Vault Integrity</h1>

        <button
          onClick={repairAll}
          disabled={repairing}
          className="px-4 py-2 bg-amber-600 text-white rounded disabled:opacity-50"
        >
          Repair All Drift
        </button>
      </div>

      <div className="space-y-4">
        {rows.map((row) => {
          const hasDrift = Object.keys(row.mismatches).length > 0;

return (
  <div
    key={row.sellerId}
    className={`border rounded p-4 ${
      hasDrift ? "border-red-500" : "border-emerald-600"
    }`}
  >
    <div className="flex justify-between items-center">
      <div>
        <div className="font-medium">Seller: {row.sellerId}</div>

        <div
          className={`text-sm ${
            hasDrift ? "text-red-600" : "text-emerald-600"
          }`}
        >
          {/* drift text goes here */}
        </div>
      </div>

     {/* right‑side content goes here */}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
