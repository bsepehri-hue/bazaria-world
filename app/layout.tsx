"use client";

import { usePathname } from "next/navigation";
import "@/app/globals.css"; // 👈 CHANGE THIS TO AN ABSOLUTE ROUTE ALIAS
import { AppProviders } from "./AppProviders";
import { DynamicLayoutWrapper } from "@/components/checkout/DynamicLayoutWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="font-sans bg-[#f8f8f5] text-slate-900">
        <AppProviders>
          <DynamicLayoutWrapper>
             {/* No AppFrame here! This keeps storefronts full-width by default */}
             {children}
          </DynamicLayoutWrapper>
        </AppProviders>
      </body>
    </html>
  );
}
