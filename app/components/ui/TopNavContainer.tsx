"use client";

export default function TopNavContainer({ children }) {
  console.log("🔥 USING TOPNAV CONTAINER");
  return (
    <div
      className="
        fixed top-0 left-0 right-0 z-50
        bg-white dark:bg-neutral-900 shadow-sm
        h-16
        grid grid-cols-[auto_1fr_auto]
        items-center
        px-6
      "
    >
      {children}
    </div>
  );
}
