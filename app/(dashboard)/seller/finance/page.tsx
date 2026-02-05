"use client";

import { useEffect, useState } from "react";
import { db } from '@/lib/firebase/client';
import { collection, getDocs } from "firebase/firestore";
import { useAuthUser } from "../../../../hooks/useAuthUser";

export default function SellerFinancePage() {
  const user = useAuthUser();
  const sellerId = user?.uid ?? null;

  if (!user || !sellerId) {
    return <p className="p-6 text-gray-600">Loading…</p>;
  }
  

  const [loading, setLoading] = useState(true);
  const [vault, setVault] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    if (sellerId) loadData();
  }, [sellerId]);

  async function loadData() {
    setLoading(true);

    const vaultSnap = await getDocs(collection(db, "vault"));
    const vaultDoc = vaultSnap.docs.find((d) => d.id === sellerId);
    setVault(vaultDoc?.data() || null);

    const timelineSnap = await getDocs(collection(db, "timeline"));
    const allEvents = timelineSnap.docs.map((d) => ({
  id: d.id,
  ...(d.data() as any),
}));

    const sellerEvents = allEvents
      .filter((e) => e.sellerId === sellerId)
      .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    setEvents(sellerEvents);
    setLoading(false);
  }

  // ---------------------------------------------------------
  // CSV EXPORT
  // ---------------------------------------------------------
  function downloadCSV() {
    const header = [
      "timestamp",
      "type",
      "label",
      "amount",
      "delta",
      "balance",
      "contextId",
    ];

    const rowsCSV = ledger.map((row) => [
      new Date(row.timestamp).toISOString(),
      row.type,
      row.label,
      row.amount,
      row.delta,
      row.balance,
      row.contextId || "",
    ]);

    const csvContent =
      [header, ...rowsCSV].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `bazaria-financial-report-${new Date().getFullYear()}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  }

  if (loading) return <div className="p-6">Loading your financial profile…</div>;

  // ---------------------------------------------------------
  // FILTER EVENTS
  // ---------------------------------------------------------
  const filtered = events.filter((e) => {
    if (!filterType) return true;
    if (filterType === "dispute") return e.label?.toLowerCase().includes("dispute");
    return e.type === filterType;
  });

  // ---------------------------------------------------------
  // LEDGER RECONSTRUCTION
  // ---------------------------------------------------------
  let running = vault?.available || 0;
  const ledger = [...filtered].reverse().map((e) => {
    let delta = 0;

    if (e.type === "sale") delta = e.amount || 0;
    if (e.type === "refund") delta = -(e.amount || 0);
    if (e.type === "payout") delta = -(e.amount || 0);

    if (e.label?.startsWith("Dispute lost")) delta = -(e.amount || 0);
    if (e.label?.startsWith("Dispute won")) delta = +(e.amount || 0);

    const row = { ...e, delta, balance: running };
    running -= delta;
    return row;
  });

  // ---------------------------------------------------------
  // TAX TOTALS
  // ---------------------------------------------------------
  const salesTotal = events
    .filter((e) => e.type === "sale")
    .reduce((s, e) => s + (e.amount || 0), 0);

  const refundTotal = events
    .filter((e) => e.type === "refund")
    .reduce((s, e) => s + (e.amount || 0), 0);

  const payoutTotal = events
    .filter((e) => e.type === "payout")
    .reduce((s, e) => s + (e.amount || 0), 0);

  const lockedTotal = vault.locked || 0;

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-xl font-semibold">Financial Profile</h1>

      {/* Vault Snapshot */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Stat label="Available" value={vault.available} color="emerald" />
        <Stat label="Locked" value={vault.locked} color="amber" />
        <Stat label="Total Earned" value={vault.totalEarned} color="emerald" />
        <Stat label="Total Refunded" value={vault.totalRefunded} color="red" />
        <Stat label="Total Payouts" value={vault.totalPayouts} color="blue" />
      </div>

      {/* TAX SUMMARY */}
      <div className="border rounded p-4 space-y-2">
        <h2 className="text-lg font-semibold">Tax Summary</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Stat label="Gross Sales" value={salesTotal} color="emerald" />
          <Stat label="Refunds" value={refundTotal} color="red" />
          <Stat label="Net Revenue" value={salesTotal - refundTotal} color="emerald" />
          <Stat label="Payouts" value={payoutTotal} color="blue" />
          <Stat label="Locked Funds" value={lockedTotal} color="amber" />
          <Stat
            label="Taxable Income"
            value={salesTotal - refundTotal - payoutTotal}
            color="emerald"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Events</option>
          <option value="sale">Sales</option>
          <option value="refund">Refunds</option>
          <option value="payout">Payouts</option>
          <option value="dispute">Disputes</option>
        </select>
      </div>

      {/* CSV EXPORT */}
      <button
        onClick={downloadCSV}
        className="px-4 py-2 bg-emerald-600 text-white rounded"
      >
        Download CSV
      </button>

      {/* Ledger Table */}
      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Timestamp</th>
              <th className="p-2 text-left">Event</th>
              <th className="p-2 text-left">Delta</th>
              <th className="p-2 text-left">Balance</th>
            </tr>
          </thead>

          <tbody>
            {ledger.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-2">
                  {new Date(row.timestamp).toLocaleString()}
                </td>
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

function Stat({ label, value, color }: any) {
  const colors: any = {
    emerald: "text-emerald-600",
    red: "text-red-600",
    amber: "text-amber-600",
    blue: "text-blue-600",
  };

  return (
    <div className="border rounded p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`text-xl font-semibold ${colors[color]}`}>{value}</div>
    </div>
  );
}
