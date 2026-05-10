'use client';

import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@/lib/wagmiConfig';
import { WalletProvider } from '@/app/context/WalletContext';

export default function WagmiClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <WalletProvider>{children}</WalletProvider>
    </WagmiProvider>
  );
}
