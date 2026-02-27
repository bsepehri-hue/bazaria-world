"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

export default function AutoBreadcrumbs() {
  const pathname = usePathname();
  const params = useParams();

  if (!pathname) return null;

  // Split into segments
  const rawSegments = pathname.split("/").filter(Boolean);

  // Resolve dynamic segments like [storeId]
  const segments = rawSegments.map((seg) => {
    if (seg.startsWith("[") && seg.endsWith("]")) {
      const key = seg.slice(1, -1);
      return params[key] ?? seg;
    }
    return seg;
  });

  // Build href for each breadcrumb
  const buildHref = (index: number) => {
    return "/" + segments.slice(0, index + 1).join("/");
  };

  return (
    <nav className="flex items-center text-sm text-gray-600 dark:text-gray-300 space-x-2">
      {segments.map((seg, i) => {
        const href = buildHref(i);
        const label = seg
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return (
          <div key={href} className="flex items-center space-x-2">
            {i > 0 && <span>/</span>}
            <Link
              href={href}
              className="hover:text-gray-900 dark:hover:text-gray-100"
            >
              {label}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
