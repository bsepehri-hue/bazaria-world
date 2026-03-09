"use client";

import { usePathname } from "next/navigation";
import SidebarMenu from "@/components/sidebar/SidebarMenu";

// NEW unified nav imports
import TopNavContainer from "@/app/components/ui/TopNavContainer";
import TopNav from "@/app/components/ui/TopNav";

// Import all internal module menus
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

  // Default menu (fallback)
  let menu = marketplaceMenu;

 // Route-based menu injection
if (path.startsWith("/market")) menu = marketMenu;
else if (path.startsWith("/marketplace")) menu = marketplaceMenu;
else if (path.startsWith("/storefronts")) menu = storefrontsMenu;
else if (path.startsWith("/auctions")) menu = auctionsMenu;
else if (path.startsWith("/vault")) menu = vaultMenu;
else if (path.startsWith("/admin")) menu = adminMenu;
else if (path.startsWith("/messages")) menu = messagesMenu;
else if (path.startsWith("/settings")) menu = settingsMenu;
else if (path.startsWith("/payable")) menu = payableMenu;
else if (path.startsWith("/rewards")) menu = rewardsMenu;

  // Public worlds (NO sidebar, NO AppFrame)
 if (
  path.startsWith("/auction-link") ||
  path.startsWith("/public")
) {
  return <>{children}</>;
}

 return (
  <>
    <TopNavContainer>
      <TopNav />
    </TopNavContainer>

    <div className="app-frame">
      <aside className="sidebar-container">
        <SidebarMenu menu={menu} />
      </aside>

      <main className="content-container">
        {children}
      </main>
    </div>
  </>
);


}
