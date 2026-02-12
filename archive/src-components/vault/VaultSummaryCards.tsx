"use client";

import React from "react";
import { VaultSummary } from "@/lib/vault/types";
import { Card } from "@/components/ui/Card";

interface Props {
  summary: VaultSummary;
}

export const VaultSummaryCards: React.FC<Props> = ({ summary }) => {
  const pendingPayouts = summary.entries
    .filter((e) => e.type === "payout")
    .reduce((sum, e) => sum + e.amount, 0);

  const lifetimeEarnings = summary.entries
    .filter((e) => e.amount > 0)
    .reduce((sum, e) => sum + e.amount, 0);

  const totalFees = summary.entries
    .filter((e) => e.type === "fee")
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Current Balance */}
      <Card padding="default">
        <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
        <p className="mt-2 text-2xl font-bold text-emerald-600">
          {summary.totalBalance.toLocaleString()} {summary.currency}
        </p>
      </Card>

      {/* Pending Payouts */}
      <Card padding="default">
        <h3 className="text-sm font-medium text-gray-500">Pending Payouts</h3>
        <p className="mt-2 text-2xl font-bold text-amber-600">
          {pendingPayouts.toLocaleString()} {summary.currency}
        </p>
      </Card>

      {/* Lifetime Earnings */}
      <Card padding="default">
        <h3 className="text-sm font-medium text-gray-500">Lifetime Earnings</h3>
        <p className="mt-2 text-2xl font-bold text-teal-600">
          {lifetimeEarnings.toLocaleString()} {summary.currency}
        </p>
      </Card>

      {/* Total Fees Paid */}
      <Card padding="default">
        <h3 className="text-sm font-medium text-gray-500">Total Fees Paid</h3>
        <p className="mt-2 text-2xl font-bold text-burgundy-600">
          {totalFees.toLocaleString()} {summary.currency}
        </p>
      </Card>
    </div>
  );
};
