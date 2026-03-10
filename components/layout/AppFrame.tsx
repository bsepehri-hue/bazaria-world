TypeScript
"use client";

import { usePathname } from "next/navigation";
import SidebarMenu from "@/components/sidebar/SidebarMenu";
import TopNav from "@/app/components/ui/TopNav";
// 🚨 We are completely removing the TopNavContainer import to kill the ghost CSS

import { marketplaceMenu } from "@/menus/marketplace";
import { storefrontsMenu } from "@/menus/storefronts";
import { auctionsMenu } from "@/menus/auctions";
import { vaultMenu } from "@/menus/vault";
import { adminMenu } from "@/menus/admin";
import { messagesMenu } from "@/menus/messages";
import { settingsMenu } from "@/menus/settings";
import { payableMenu } from "@/menus/payable";
import { rewardsMenu } from "@/menus/rewards";
import { marketMenu } from "@/menus/market";

export default function AppFrame({ children }) {
  const path = usePathname();

  let menu = marketplaceMenu;

  if (path.startsWith("/marketplace")) menu = marketplaceMenu;
  else if (path.startsWith("/market")) menu = marketMenu;
  else if (path.startsWith("/storefronts")) menu = storefrontsMenu;
  else if (path.startsWith("/auctions")) menu = auctionsMenu;
  else if (path.startsWith("/vault")) menu = vaultMenu;
  else if (path.startsWith("/admin")) menu = adminMenu;
  else if (path.startsWith("/messages")) menu = messagesMenu;
  else if (path.startsWith("/settings")) menu = settingsMenu;
  else if (path.startsWith("/payable")) menu = payableMenu;
  else if (path.startsWith("/rewards")) menu = rewardsMenu;

  // Public pages bypass the frame
  if (path.startsWith("/auction-link") || path.startsWith("/public")) {
    return <>{children}</>;
  }

  return (
    // 1. h-screen locks the app to the window height so we can scroll the main content independently
    <div className="w-full h-screen flex flex-col overflow-hidden bg-white">

      {/* 2. FIXED TOP NAV - Replaced TopNavContainer with a pure Tailwind header */}
      <header className="h-16 w-full flex-shrink-0 z-50">
        <TopNav />
      </header>

      {/* EVERYTHING BELOW THE TOP NAV */}
      <div className="flex flex-row flex-1 overflow-hidden">

        {/* 3. SIDEBAR - Dropped '.sidebar'. w-64 gives fixed width, shrink-0 prevents it from getting crushed */}
        <aside className="w-64 flex-shrink-0 h-full overflow-y-auto border-r border-gray-200">
          <SidebarMenu menu={menu} />
        </aside>

        {/* 4. MAIN CONTENT - flex-1 takes up the rest of the screen on the right */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>

      </div>
    </div>
  );
}
