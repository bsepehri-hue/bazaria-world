'use client';

import { useWallet } from "../../hooks/useWallet";
import { shortenAddress } from '@/lib/utils';

export const WalletButton: React.FC = () => {
  const { isConnected, walletAddress, connect, disconnect, connectors } = useWallet();

  const handleWalletAction = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect({ connector: connectors[0] });
    }
  };

  return (
    <button onClick={handleWalletAction} className="px-3 py-1 rounded bg-emerald-600 text-white">
      {isConnected ? walletAddress?.slice(0, 6) + "..." + walletAddress?.slice(-4) : "Connect Wallet"}
    </button>
  );
};
