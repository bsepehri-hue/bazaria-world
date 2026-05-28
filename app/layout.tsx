// 🎯 TAILWIND BUNDLES GLOBALLY - CLEAN SERVER COMPONENT
import "@/app/globals.css"; 
import { AppProviders } from "./AppProviders";
import { DynamicLayoutWrapper } from "@/components/checkout/DynamicLayoutWrapper";
import ClientSupportChat from "@/components/ui/ClientSupportChat";

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

          {/* ⚡ Self-contained floating support manager */}
          <ClientSupportChat />
          
        </AppProviders>
      </body>
    </html>
  );
}
