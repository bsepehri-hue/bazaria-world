"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SidebarMenu({ menu }) {
  const pathname = usePathname();

  return (
    <nav className="sidebar-menu">
      {menu.map((item) => {
        const isActive =
          pathname === item.href ||
          (pathname.startsWith(item.href) && item.href !== "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-item ${isActive ? "active" : ""}`}
          >
            <div className="icon-wrapper">
  <FontAwesomeIcon icon={item.icon} />
</div>
            <span className="label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
