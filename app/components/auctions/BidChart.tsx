"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { Bid } from "@/types/auction";


interface BidChartProps {
  bids: Bid[];
}

export default function BidChart({ bids }: BidChartProps) {
  // Transform bids into chart-friendly data
  const data = bids.map((bid) => ({
    bidder: bid.bidder.slice(0, 6) + "...", // shorten address
    amount: Number(bid.amount) / 1e18,      // convert wei to ETH
    time: bid.timestamp.toLocaleTimeString(),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="bidder" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="amount" fill="#14b8a6">
          <LabelList dataKey="time" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
