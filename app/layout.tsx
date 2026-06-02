// 🎯 TAILWIND BUNDLES GLOBALLY - CLEAN SERVER COMPONENT
import "@/app/globals.css"; 
import { AppProviders } from "./AppProviders";
import { DynamicLayoutWrapper } from "@/components/checkout/DynamicLayoutWrapper";
import ClientSupportChat from "@/components/ui/ClientSupportChat";
import { Metadata, Viewport } from "next";
import { CartProvider } from "@/context/CartContext";

// 📡 CORE PWA APP REGISTER METADATA HOOKS
export const metadata: Metadata = {
  title: "Bazaria World",
  description: "Sovereign Marketplace",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bazaria",
  },
};

// 🎨 NATIVE MOBILE MOBILE WORKSPACE SHIELDING
export const viewport: Viewport = {
  themeColor: "#05292e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents layout zooming when typing inputs on smaller mobile screens
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Apple Status Bar Overlays Configuration Layer */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
    <body>
        <AppProviders>
          {/* ⚡ Nest your CartProvider right here to expose it to the Layout Wrapper! */}
          <CartProvider> 
            <DynamicLayoutWrapper>
              {children}
            </DynamicLayoutWrapper>
          </CartProvider>

          {/* ⚡ Temporarily disabled to restore global site navigation for live demos */}
          {/* <ClientSupportChat /> */}
          
        </AppProviders>
      </body>
    </html>
  );
}
