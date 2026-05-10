// components/SalesChart.jsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function SalesChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="gross" stroke="#0d9488" name="Gross Sales" />
        <Line type="monotone" dataKey="net" stroke="#10b981" name="Net Sales" />
      </LineChart>
    </ResponsiveContainer>
  );
}