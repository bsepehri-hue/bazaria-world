import { useState } from "react";

export default function Onboarding() {
  const [form, setForm] = useState({
    store_name: "",
    category: "",
    description: "",
    accepted_oath: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/stewards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message);

    // Reset form
    setForm({
      store_name: "",
      category: "",
      description: "",
      accepted_oath: false,
    });
  };

  const categories = ["Artifacts", "Apparel", "Offerings"];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Steward Onboarding</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="store_name"
          placeholder="Store Name"
          className="border p-2 w-full"
          value={form.store_name}
          onChange={handleChange}
        />

        <select
          name="category"
          className="border p-2 w-full"
          value={form.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Store Description"
          className="border p-2 w-full"
          value={form.description}
          onChange={handleChange}
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="accepted_oath"
            checked={form.accepted_oath}
            onChange={handleChange}
          />
          <span>I vow to protect cadence</span>
        </label>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Join the Scroll
        </button>
      </form>
    </div>
  );
}