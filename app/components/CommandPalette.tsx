"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Open with Cmd+K or Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const actions = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Notifications", path: "/dashboard/notifications" },
    { label: "Profile", path: "/dashboard/profile" },
    { label: "Settings", path: "/dashboard/settings" },
    { label: "Create Listing", path: "/dashboard/listings/create" },
    { label: "My Listings", path: "/dashboard/listings" },
    { label: "Disputes", path: "/dashboard/disputes" },
    { label: "Payments", path: "/dashboard/payments" },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const go = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-start justify-center pt-32">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700">
        
        {/* Search Input */}
        <div className="border-b dark:border-gray-700 p-4">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or jump to…"
            className="w-full bg-transparent outline-none text-gray-900 dark:text-gray-100 text-lg"
          />
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="p-4 text-gray-500 dark:text-gray-400">No results</p>
          )}

          {filtered.map((a) => (
            <button
              key={a.path}
              onClick={() => go(a.path)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}