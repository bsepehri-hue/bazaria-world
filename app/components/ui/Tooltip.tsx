"use client";

import { useState } from "react";

export default function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap rounded-md bg-gray-900 text-white text-xs px-2 py-1 opacity-90 shadow-lg z-50">
          {text}
        </div>
      )}
    </div>
  );
}
