import { useStewards } from "../hooks/useStewards";

export default function StewardsLeaderboard() {
  const { stewards, loading } = useStewards();

  if (loading) return <p>Loading stewards...</p>;

  // Sort by referrals descending
  const sorted = [...stewards].sort((a, b) => b.referrals - a.referrals);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Top Stewards Leaderboard</h1>
      {sorted.length === 0 ? (
        <p>No stewards onboarded yet.</p>
      ) : (
        <ol className="space-y-4 list-decimal list-inside">
          {sorted.map((s, i) => (
            <li
              key={i}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <strong>{s.store_name}</strong> — {s.category}
                <p>{s.description}</p>
                <small>Joined: {new Date(s.createdAt).toLocaleString()}</small>
              </div>
              <span className="bg-blue-600 text-white px-3 py-1 rounded">
                Referrals: {s.referrals}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}