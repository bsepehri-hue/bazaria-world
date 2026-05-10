// pages/onboarding.jsx
import { useState } from 'react';

export default function Onboarding() {
  const [form, setForm] = useState({
    store_name: '',
    category: '',
    description: '',
    accepted_oath: false,
  });

  const options = [
    { label: 'Artifacts', value: 'artifacts' },
    { label: 'Apparel', value: 'apparel' },
    { label: 'Offerings', value: 'offerings' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Steward submitted: ' + JSON.stringify(form, null, 2));
    // Later you can wire this up to save data to JSON or a DB
  };

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
          {options.map((option, idx) => (
            <option key={idx} value={option.value}>
              {option.label}
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
          <span>I accept the Steward's Oath.</span>
        </label>

        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Claim My Scroll
        </button>
      </form>
    </div>
  );
}
