"use client";

import React from "react";
import AuthProvider from "./providers/AuthProvider";
import { WalletProvider } from "./context/WalletContext";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import directly from your existing library file with the correct name/path
import { wagmiConfig } from "@/lib/wagmiConfig";

// 1. Initialize QueryClient
const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <WalletProvider>
            {children}
          </WalletProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </AuthProvider>
  );
}
