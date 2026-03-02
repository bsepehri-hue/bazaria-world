import "./globals.css";

import AuthProvider from "./providers/AuthProvider";
import { Providers } from "./providers";
import { WalletProvider } from "./context/WalletContext";
import ClientTopNavWrapper from "./components/ui/ClientTopNavWrapper";
import CategoryMenu from "@/components/navigation/CategoryMenu";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-slate-950 text-slate-50">
        <div style={{ background: "yellow", height: "4px" }}></div>
        <AuthProvider>
          <Providers>
            <WalletProvider>
              <ClientTopNavWrapper />

              {/* Global top category menu */}
             

             {children}

            </WalletProvider>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
