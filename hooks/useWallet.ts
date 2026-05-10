import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export function useWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();

  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Sync wagmi address into local state
  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
    } else {
      setWalletAddress(null);
    }
  }, [isConnected, address]);

  return {
    walletAddress,
    isConnected,
    connect,
    connectors,
    disconnect,
    connectError,
  };
}