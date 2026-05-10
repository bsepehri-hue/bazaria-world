import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import SalesChart from "../components/SalesChart";
import ReferralsChart from "../components/ReferralsChart";
import PayoutsLedger from "../components/PayoutsLedger";

export default function Dashboard({ initialData }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000"); // adjust for production

    ws.onmessage = (event) => {
      try {
        const updatedData = JSON.parse(event.data);
        setData(updatedData);
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, []);

  const { sales, referrals, payouts } = data;

  return (
    <div className="dashboard-container p-6">
      {/* Header Stats */}
      <div className="header-stats grid grid-cols-3 gap-4 mb-6">
        <div className="stat-card bg-white shadow rounded p-4">
          <h3 className="text-sm font-semibold">Sales</h3>
          <p className="text-xl font-bold">
            {sales?.length ? `$${sales.reduce((acc, s) => acc + s.gross, 0)}` : "—"}
          </p>
        </div>
        <div className="stat-card bg-white shadow rounded p-4">
          <h3 className="text-sm font-semibold">Referrals</h3>
          <p className="text-xl font-bold">
            {referrals?.length ? referrals.reduce((acc, r) => acc + r.count, 0) : "—"}
          </p>
        </div>
        <div className="stat-card bg-white shadow rounded p-4">
          <h3 className="text-sm font-semibold">Payouts</h3>
          <p className="text-xl font-bold">
            {payouts?.length ? `$${payouts.reduce((acc, p) => acc + p.amount, 0)}` : "—"}
          </p>
        </div>
      </div>

      {/* Sales Chart */}
      {sales?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Sales Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sales}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="gross" stroke="#0d9488" name="Gross Sales" />
              <Line type="monotone" dataKey="net" stroke="#10b981" name="Net Sales" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Referrals Chart */}
      {referrals?.length > 0 && (
        <div className="mb-6">
          <ReferralsChart data={referrals} />
        </div>
      )}

      {/* Payouts Ledger */}
      {payouts?.length > 0 && (
        <div className="mb-6">
          <PayoutsLedger data={payouts} />
        </div>
      )}
    </div>
  );
}

// Server-side hydration
export async function getServerSideProps() {
  try {
    const res = await fetch("http://localhost:3000/api/dashboard");
    const initialData = await res.json();
    return { props: { initialData } };
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    return { props: { initialData: { sales: [], referrals: [], payouts: [] } } };
  }
}
