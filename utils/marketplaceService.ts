import { BrowserProvider, Contract, parseUnits } from "ethers";

// 1. Your Live Contract Addresses on Polygon Amoy
const MARKETPLACE_ADDRESS = "0x875B0406cAfeE6C097065c9979aFdFd6058b609b"; // The contract Account 1 deployed!
const USDC_ADDRESS = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"; // The official Circle USDC token

// 2. Minimal ABIs (Only the functions we actually need)
const USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

const MARKETPLACE_ABI = [
  "function buyAsset(string memory _assetId) external",
  "function listAsset(string memory _assetId, uint256 _buyNowPrice, uint256 _reservePrice) external"
];

export const executeBuyNow = async (firebaseAssetId: string, usdcPrice: number) => {
  try {
    // 3. Connect to MetaMask using Ethers v6
    if (!window.ethereum) throw new Error("MetaMask is not installed!");
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    // 4. Format the USDC Price (USDC uses 6 decimals, not 18!)
    const priceInWei = parseUnits(usdcPrice.toString(), 6);

    // 5. Initialize Contracts
    const usdcContract = new Contract(USDC_ADDRESS, USDC_ABI, signer);
    const marketplaceContract = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);

    console.log(`Checking USDC allowance for ${usdcPrice} USDC...`);
    
    // 6. Check Allowance & Approve if necessary (The "Upfront Permission" we talked about)
    const currentAllowance = await usdcContract.allowance(userAddress, MARKETPLACE_ADDRESS);
    
    if (currentAllowance < priceInWei) {
      console.log("Requesting USDC Approval from user...");
      const approveTx = await usdcContract.approve(MARKETPLACE_ADDRESS, priceInWei);
      await approveTx.wait(); // Wait for the blockchain to confirm the approval
      console.log("USDC Approved!");
    }

    // 7. Execute the Purchase
    console.log("Executing Buy Now transaction...");
    const buyTx = await marketplaceContract.buyAsset(firebaseAssetId);
    
    // 8. Wait for the transaction to finalize
    const receipt = await buyTx.wait();
    console.log("🎉 Asset Purchased Successfully!", receipt.hash);
    
    return receipt;

  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
};
export const executeListAsset = async (firebaseAssetId: string, buyNowPrice: number, reservePrice: number) => {
  try {
    if (!window.ethereum) throw new Error("MetaMask is not installed!");
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Format prices for USDC (6 decimals)
    const formattedBuyNow = parseUnits(buyNowPrice.toString(), 6);
    const formattedReserve = parseUnits(reservePrice.toString(), 6);

    const marketplaceContract = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);

    console.log("Registering asset on Bazaria Marketplace...");
    
    // Call the contract function
    const listTx = await marketplaceContract.listAsset(
      firebaseAssetId, 
      formattedBuyNow, 
      formattedReserve
    );
    
    const receipt = await listTx.wait();
    console.log("🎉 Asset Listed Successfully!", receipt.hash);
    
    return receipt;

  } catch (error) {
    console.error("Listing failed:", error);
    throw error;
  }
};
