"use client";

import ClientQueryProvider from "./ClientQueryProvider.client";
import WagmiClientProvider from "./WagmiClientProvider.client";
import ThemeProvider from "./ThemeProvider.client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ClientQueryProvider>
        <WagmiClientProvider>
          {children}
        </WagmiClientProvider>
      </ClientQueryProvider>
    </ThemeProvider>
  );
}
