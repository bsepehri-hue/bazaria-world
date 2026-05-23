// 🎯 REMOVED "use client" FROM HERE SO TAILWIND BUNDLES GLOBALLY
import "@/app/globals.css"; 
import { AppProviders } from "./AppProviders";
import { DynamicLayoutWrapper } from "@/components/checkout/DynamicLayoutWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {/* This wrapper automatically handles your path checking, Cart, and AI Concierge! */}
          <DynamicLayoutWrapper>
            {children}
          </DynamicLayoutWrapper>
        </AppProviders>
      </body>
    </html>
  );
}
