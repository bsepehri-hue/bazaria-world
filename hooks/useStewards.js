import { useState, useEffect } from "react";

export function useStewards() {
  const [stewards, setStewards] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all stewards
  async function fetchStewards() {
    setLoading(true);
    const res = await fetch("/api/stewards");
    const data = await res.json();
    setStewards(data);
    setLoading(false);
  }

  // Add new steward
  async function addSteward(form) {
    const res = await fetch("/api/stewards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    await fetchStewards(); // refresh list
    return data;
  }

  // Increment referrals
  async function addReferral(storeName, increment = 1) {
    const res = await fetch("/api/stewards", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ store_name: storeName, increment }),
    });
    const data = await res.json();

    // Update local state immediately
    setStewards((prev) =>
      prev.map((s) =>
        s.store_name === storeName ? { ...s, referrals: data.steward.referrals } : s
      )
    );

    return data;
  }

  // Load on mount
  useEffect(() => {
    fetchStewards();
  }, []);

  return { stewards, loading, fetchStewards, addSteward, addReferral };
}