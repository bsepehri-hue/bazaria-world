"use client";

export default function TopNavContainer({ children }) {
  return (
    <div
      className="
        fixed top-0 left-0 right-0 z-50
        bg-white dark:bg-neutral-900 shadow-sm
        h-16
        flex items-center
        px-4
      "
    >
      {children}
    </div>
  );
}
