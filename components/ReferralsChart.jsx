// components/ReferralsChart.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ReferralsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="referrer" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#f59e0b" name="Referral Count" />
        <Bar dataKey="residual" fill="#10b981" name="Residual Income ($)" />
      </BarChart>
    </ResponsiveContainer>
  );
}