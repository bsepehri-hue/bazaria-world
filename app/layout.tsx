import "./globals.css";

import AuthProvider from "./providers/AuthProvider";
import Providers from "./providers/Providers";
import WalletProvider from "./context/WalletProvider";
import ClientTopNavWrapper from "./components/ClientTopNavWrapper";
import GlobalCategoryMenu from "./components/GlobalCategoryMenu";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-slate-950 text-slate-50">
        <AuthProvider>
          <Providers>
            <WalletProvider>
              <ClientTopNavWrapper />

         }
{/* ⭐ Global menu goes here */}
<GlobalCategoryMenu />
<main className="p-4">
  {children}
</main>
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
