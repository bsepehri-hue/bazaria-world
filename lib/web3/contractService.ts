import { ethers } from "ethers";

// Fallback empty ABI for layout compilation - we can populate this with your escrow/bidding contract logic later
export const BAZARIA_MARKETPLACE_ABI: any[] = [
  "function listAsset(uint256 assetId, uint256 reservePrice) external",
  "function placeBid(uint256 assetId) external payable",
  "function claimAsset(uint256 assetId) external",
  "function getAssetDetails(uint256 assetId) external view returns (address seller, uint256 reservePrice, uint256 highestBid, address highestBidder, bool active)"
];

export interface WalletState {
  address: string | null;
  balance: string | null;
  chainId: number | null;
  isConnected: boolean;
}

/**
 * Connects the user's Web3 Browser Wallet (MetaMask, etc.)
 */
export async function connectBrowserWallet(): Promise<WalletState> {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("No cryptographic browser wallet detected. Please install MetaMask.");
  }

  try {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    
    // Request account access
    const accounts = await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();
    
    if (accounts.length === 0) {
      throw new Error("No accounts authorized.");
    }

    const address = accounts[0];
    const rawBalance = await provider.getBalance(address);
    const balance = ethers.formatEther(rawBalance);

    return {
      address,
      balance: parseFloat(balance).toFixed(4),
      chainId: Number(network.chainId),
      isConnected: true
    };
  } catch (error: any) {
    console.error("Wallet connection failure:", error);
    throw error;
  }
}

/**
 * Triggers a secure transaction payload to place a bid on an asset
 */
export async function triggerBlockchainBid(contractAddress: string, assetId: number, bidAmountEth: string) {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("Wallet provider uninitialized.");
  }

  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();
  
  // Create contract instance tied to the signer
  const contract = new ethers.Contract(contractAddress, BAZARIA_MARKETPLACE_ABI, signer);
  
  // Convert value string to raw wei
  const parsedValue = ethers.parseEther(bidAmountEth);
  
  // Execute transactional payload
  const tx = await contract.placeBid(assetId, { value: parsedValue });
  
  // Wait for 1 block confirmation on-chain
  const receipt = await tx.wait(1);
  return receipt;
}
