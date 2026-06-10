"use client";

import React, { useState, useEffect } from "react";
import AuthProvider from "./providers/AuthProvider";
import { WalletProvider } from "./context/WalletContext";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wagmiConfig";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // 🛡️ GATEWAY EFFECT: Break background initialization/reconnection loops
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {/* Only hook up the heavy Web3 network adapters once the client layout is cleanly stable */}
        {mounted ? (
          <WagmiProvider config={wagmiConfig}>
            <WalletProvider>
              {children}
            </WalletProvider>
          </WagmiProvider>
        ) : (
          // Render the rest of your core UI layout immediately while the Web3 connection pool warms up
          children 
        )}
      </QueryClientProvider>
    </AuthProvider>
  );
}
