"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function TopLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Trigger loading animation on route change
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 600); // smooth fade-out

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div
      className={`fixed top-0 left-0 h-[3px] z-[9999] transition-all duration-500 ${
        loading ? "w-full opacity-100" : "w-0 opacity-0"
      } bg-teal-500`}
    />
  );
}