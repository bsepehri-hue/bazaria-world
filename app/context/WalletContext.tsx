"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
} from "wagmi";

interface WalletContextType {
  address: string | undefined;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  balance: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: balanceData } = useBalance({
    address: address as `0x${string}` | undefined,
    enabled: isConnected,
  });

  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    if (balanceData?.formatted) {
      setBalance(balanceData.formatted);
    } else {
      setBalance(null);
    }
  }, [balanceData]);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        connect: () => connect({ connector: connectors[0] }),
        disconnect,
        balance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used inside WalletProvider");
  }
  return ctx;
}
