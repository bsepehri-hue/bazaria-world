import "./globals.css";

import ClientTopNavWrapper from "@/app/components/ui/ClientTopNavWrapper";
import { WalletProvider } from "@/app/context/WalletContext";
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
   <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-slate-950 text-slate-50">
        <Providers>
          <WalletProvider>
            <ClientTopNavWrapper />
            {children}
          </WalletProvider>
        </Providers>
      </body>
    </html>
  );
}
