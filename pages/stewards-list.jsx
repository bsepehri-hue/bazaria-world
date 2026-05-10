import { useStewards } from "../hooks/useStewards";

export default function StewardsList() {
  const { stewards, addReferral, loading } = useStewards();

  if (loading) return <p>Loading stewards...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Stewards Scroll</h1>
      {stewards.length === 0 ? (
        <p>No stewards onboarded yet.</p>
      ) : (
        <ul className="space-y-4">
          {stewards.map((s, i) => (
            <li
              key={i}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <strong>{s.store_name}</strong> — {s.category}
                <p>{s.description}</p>
                <small>Joined: {new Date(s.createdAt).toLocaleString()}</small>
                <p>Referrals: {s.referrals}</p>
              </div>
              <button
                onClick={() => addReferral(s.store_name)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                +1 Referral
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}