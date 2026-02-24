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
  <aside className="w-64 border-r border-slate-800 p-4">
    <GlobalCategoryMenu />
  </aside>

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
