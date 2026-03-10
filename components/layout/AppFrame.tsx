"use client";

import { usePathname } from "next/navigation";
import SidebarMenu from "@/components/sidebar/SidebarMenu";
import TopNav from "@/app/components/ui/TopNav";
import TopNavContainer from "@/app/components/ui/TopNavContainer";

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

  if (path.startsWith("/auction-link") || path.startsWith("/public")) {
    return <>{children}</>;
  }

  return (
   <div className="w-full min-h-screen flex flex-col overflow-hidden">
      {/* FIXED TOP NAV */}
      <TopNavContainer>
        <TopNav />
      </TopNavContainer>

      {/* MAIN AREA */}
      <div className="flex flex-row flex-1 pt-16 overflow-auto">

        <aside className="sidebar-container h-full overflow-y-auto">
          <SidebarMenu menu={menu} />
        </aside>

        <main className="content-container flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}
