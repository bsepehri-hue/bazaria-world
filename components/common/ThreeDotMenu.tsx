import { useState } from "react";

export function ThreeDotMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full bg-black/40 text-white"
      >
        ⋮
      </button>

      {/* Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50">
          {children}
        </div>
      )}
    </div>
  );
}
