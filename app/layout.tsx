import "./globals.css";

import ClientTopNavWrapper from "./components/ui/ClientTopNavWrapper";
import { WalletProvider } from "./context/WalletContext";
import { Providers } from "./providers";
import GlobalCategoryMenu from "./components/GlobalCategoryMenu";
import AuthProvider from "./providers/AuthProvider";



import AuthProvider from "./providers/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-slate-950 text-slate-50">
        <AuthProvider>
          <Providers>
            <WalletProvider>
              <ClientTopNavWrapper />
              {children}
            </WalletProvider>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}

            {/* ⭐ Add the menu right here */}
            <GlobalCategoryMenu />

            <main className="p-4">
              {children}
            </main>

          </WalletProvider>
        </Providers>
      </body>
    </html>
  );
}
