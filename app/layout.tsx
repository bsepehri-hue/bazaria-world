import "@/app/globals.css"; // 🟢 Global CSS is now safely imported in a Server Component
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
          {/* Move any usePathname conditional layout logic inside this wrapper component instead */}
          <DynamicLayoutWrapper>
            {children}
          </DynamicLayoutWrapper>
        </AppProviders>
      </body>
    </html>
  );
}
