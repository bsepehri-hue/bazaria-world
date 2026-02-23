import "./globals.css";

import ClientTopNavWrapper from "./components/ui/ClientTopNavWrapper";
import { WalletProvider } from "./context/WalletContext";
import { Providers } from "./providers";
import GlobalCategoryMenu from "./components/GlobalCategoryMenu";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-slate-950 text-slate-50">
        <Providers>
          <WalletProvider>
            <ClientTopNavWrapper />

            <div className="flex">
              {/* ⭐ Global Sidebar Menu */}
              <aside className="w-64 border-r border-slate-800 p-4">
                <GlobalCategoryMenu />
              </aside>

              {/* ⭐ Main Content */}
              <main className="flex-1 p-4">
                {children}
              </main>
            </div>

          </WalletProvider>
        </Providers>
      </body>
    </html>
  );
}
