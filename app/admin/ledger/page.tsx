"use client";

import { useEffect, useState } from "react";
import { db } from '@/lib/firebase/server';
import { collection, getDocs } from "firebase/firestore";

export default function LedgerHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [filterSeller, setFilterSeller] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    loadLedger();
  }, []);

  async function loadLedger() {
  setLoading(true);

  type TimelineEvent = {
    id: string;
    sellerId?: string;
    type?: string;
    label?: string;
    amount?: number;
    timestamp?: number;
  };

  const timelineSnap = await getDocs(collection(db, "timeline"));
  const vaultSnap = await getDocs(collection(db, "vault"));

  const events: TimelineEvent[] = timelineSnap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as any),
  }));

  const vaultDocs = vaultSnap.docs.map((d) => ({
  id: d.id,
  ...(d.data() as {
    available: number;
    totalEarned?: number;
    totalRefunded?: number;
    totalPayouts?: number;
    locked?: number;
    updatedAt?: number;
  }),
}));

  // Sort events by timestamp
  events.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    const ledgerRows: any[] = [];

    // Running balance per seller
    const running: Record<string, number> = {};

    for (const event of events) {
      const sellerId = event.sellerId;
      if (!sellerId) continue;

      if (!running[sellerId]) {
        const vault = vaultDocs.find((v) => v.id === sellerId);
        running[sellerId] = vault?.available || 0;
      }

      let delta = 0;

      if (event.type === "sale") delta = event.amount || 0;
      if (event.type === "refund") delta = -(event.amount || 0);
      if (event.type === "payout") delta = -(event.amount || 0);

      if (event.label?.startsWith("Dispute opened")) delta = 0;
      if (event.label?.startsWith("Dispute lost")) delta = -(event.amount || 0);
      if (event.label?.startsWith("Dispute won")) delta = +(event.amount || 0);

      running[sellerId] += delta;

      ledgerRows.push({
        id: event.id,
        sellerId,
        type: event.type,
        label: event.label,
        amount: event.amount || 0,
        delta,
        balance: running[sellerId],
        timestamp: event.timestamp || 0,
      });
    }

    setRows(ledgerRows);
    setLoading(false);
  }

  const filtered = rows.filter((r) => {
    if (filterSeller && r.sellerId !== filterSeller) return false;
    if (filterType && r.type !== filterType) return false;
    return true;
  });

  if (loading) return <div className="p-6">Loading ledger…</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Ledger History</h1>

      {/* Filters */}
      <div className="flex gap-4">
        <input
          placeholder="Filter by sellerId"
          value={filterSeller}
          onChange={(e) => setFilterSeller(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          <option value="sale">Sale</option>
          <option value="refund">Refund</option>
          <option value="payout">Payout</option>
          <option value="dispute">Dispute</option>
        </select>
      </div>

      {/* Ledger Table */}
      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Timestamp</th>
              <th className="p-2 text-left">Seller</th>
              <th className="p-2 text-left">Event</th>
              <th className="p-2 text-left">Delta</th>
              <th className="p-2 text-left">Balance</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-2">
                  {new Date(row.timestamp).toLocaleString()}
                </td>
                <td className="p-2">{row.sellerId}</td>
                <td className="p-2">{row.label}</td>

                <td
                  className={`p-2 font-medium ${
                    row.delta > 0
                      ? "text-emerald-600"
                      : row.delta < 0
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {row.delta > 0 ? "+" : ""}
                  {row.delta}
                </td>

                <td className="p-2 font-semibold">{row.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
