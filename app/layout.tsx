import "./globals.css";

import ClientTopNavWrapper from "@/app/components/ui/ClientTopNavWrapper";
import Web3Provider from "@/components/providers/Web3Provider";
import { WalletProvider } from "@/context/WalletContext";
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body className="font-sans bg-slate-950 text-slate-50">
        <Web3Provider>
          <WalletProvider>
            <Providers>
              <ClientTopNavWrapper />
              {children}
            </Providers>
          </WalletProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
