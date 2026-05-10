"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Ban,
  CreditCard,
  ExternalLink,
} from "lucide-react";
import { Transaction } from "@/lib/vault/types"; // ✅ unified type location
import { formatEther, shortenAddress } from "@/lib/utils";

interface TransactionRowProps {
  transaction: Transaction;
}

const getTransactionMetadata = (type: Transaction["type"], amount: number) => {
  const isPositive = amount >= 0;
  switch (type) {
    case "EARNING":
      return {
        icon: ArrowDownLeft,
        color: "text-green-600 bg-green-100",
        label: "Earning",
        sign: "+",
      };
    case "PAYOUT":
      return {
        icon: ArrowUpRight,
        color: "text-red-600 bg-red-100",
        label: "Payout",
        sign: "-",
      };
    case "DEPOSIT":
      return {
        icon: CreditCard,
        color: "text-blue-600 bg-blue-100",
        label: "Deposit",
        sign: "+",
      };
    case "FEE":
      return {
        icon: Ban,
        color: "text-yellow-600 bg-yellow-100",
        label: "Fee",
        sign: "-",
      };
    default:
      return {
        icon: CreditCard,
        color: "text-gray-600 bg-gray-100",
        label: type,
        sign: isPositive ? "+" : "-",
      };
  }
};

export const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
  const { amount, type, description, token, timestamp, txnHash } = transaction;
  const { icon: Icon, color, sign, label } = getTransactionMetadata(type, amount);

  // Display absolute value
  const displayAmount = formatEther(Math.abs(amount));
  const dateFormatted = timestamp.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const timeFormatted = timestamp.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="grid grid-cols-12 gap-4 py-4 px-2 border-b border-gray-100 hover:bg-gray-50 transition duration-150">
      {/* Type and Description */}
      <div className="col-span-6 md:col-span-4 flex items-center space-x-3">
        <div className={`p-2 rounded-full flex-shrink-0 ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{description}</p>
          <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        </div>
      </div>

      {/* Amount */}
      <div className="col-span-3 md:col-span-2 text-right">
        <p className={`font-semibold ${amount >= 0 ? "text-green-700" : "text-red-700"}`}>
          {sign} {displayAmount}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{token}</p>
      </div>

      {/* Date */}
      <div className="col-span-3 md:col-span-2 hidden sm:block text-right">
        <p className="text-sm font-medium text-gray-700">{dateFormatted}</p>
        <p className="text-xs text-gray-500 mt-0.5">{timeFormatted}</p>
      </div>

      {/* Transaction Hash / Link */}
      <div className="col-span-12 md:col-span-4 flex justify-end items-center space-x-2">
        {txnHash !== "0x00000000000000000000000000000000" ? (
          <Link
            href={`https://amoy.polygonscan.com/tx/${txnHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-teal-600 hover:text-teal-800 text-sm font-medium transition"
          >
            {shortenAddress(txnHash)}
            <ExternalLink className="w-4 h-4 ml-1" />
          </Link>
        ) : (
          <p className="text-sm text-gray-400">Off-chain Record</p>
        )}
      </div>
    </div>
  );
};
