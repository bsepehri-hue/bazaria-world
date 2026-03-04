import "./globals.css";

import AuthProvider from "./providers/AuthProvider";
import { Providers } from "./providers";
import { WalletProvider } from "./context/WalletContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-slate-950 text-slate-50 overflow-visible">
        <AuthProvider>
          <Providers>
            <WalletProvider>
              {children}
            </WalletProvider>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
