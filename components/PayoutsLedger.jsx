// components/PayoutsLedger.jsx
import React from "react";

export default function PayoutsLedger({ data }) {
  return (
    <div className="payouts-ledger bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold mb-2">Payouts Ledger</h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="text-left px-2 py-1">Date</th>
            <th className="text-left px-2 py-1">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.date}>
              <td className="px-2 py-1">{p.date}</td>
              <td className="px-2 py-1">${p.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}