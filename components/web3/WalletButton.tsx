'use client';

import { useWallet } from "../../hooks/useWallet";
import { shortenAddress } from '@/lib/utils';

export const WalletButton: React.FC = () => {
  const { isConnected, walletAddress, connect, disconnect } = useWallet();

  const handleWalletAction = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  const buttonText = isConnected
    ? shortenAddress(address!)
    : 'Connect Wallet';

  const buttonClass = isConnected
    ? 'bg-emerald-600 hover:bg-emerald-700'
    : 'bg-teal-600 hover:bg-teal-700';

  return (
    <button
      onClick={handleWalletAction}
      className={`wallet-btn text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out whitespace-nowrap ${buttonClass}`}
    >
      {buttonText}
    </button>
  );
};
