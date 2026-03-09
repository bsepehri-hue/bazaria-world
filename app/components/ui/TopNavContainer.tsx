"use client";

export default function TopNavContainer({ children }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 shadow-sm">
     <div className="w-full px-6">
  {children}
</div>
    </div>
  );
}
