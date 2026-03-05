"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { faBell, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ClientTopNav() {
  const pathname = usePathname();

  return (
    <header className="topnav">
      <div className="topnav-left">
        <Link href="/marketplace" className="topnav-logo">
          Bazaria
        </Link>
      </div>

      <div className="topnav-right">
        <Link href="/notifications" className="topnav-icon">
          <FontAwesomeIcon icon={faBell} />
        </Link>

        <Link href="/settings/profile" className="topnav-icon">
          <FontAwesomeIcon icon={faUserCircle} />
        </Link>
      </div>
    </header>
  );
}
