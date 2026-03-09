import "./globals.css";

import AuthProvider from "./providers/AuthProvider";
import { Providers } from "./providers";
import { WalletProvider } from "./context/WalletContext";
import AppFrame from "@/components/layout/AppFrame";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-slate-950 text-slate-50 overflow-visible">
        <AuthProvider>
          <Providers>
            <WalletProvider>
              <AppFrame>
                {children}
              </AppFrame>
            </WalletProvider>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
