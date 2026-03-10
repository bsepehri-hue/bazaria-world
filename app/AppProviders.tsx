"use client";

import AuthProvider from "./providers/AuthProvider";
import { Providers } from "./providers";
import { WalletProvider } from "./context/WalletContext";

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <Providers>
        <WalletProvider>{children}</WalletProvider>
      </Providers>
    </AuthProvider>
  );
}
