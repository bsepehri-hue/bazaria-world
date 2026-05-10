"use client";

export default function TopNavContainer({ children }) {
  return (
    <div className="fixed top-0 left-0 w-full h-16 z-50 bg-neutral-900 border-b border-neutral-800 grid grid-cols-[auto_1fr_auto] items-center px-4">
      {children}
    </div>
  );
}
