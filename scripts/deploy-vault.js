import hre from "hardhat";
import { ethers } from "ethers";
import dotenv from "dotenv";

// Explicitly load the local environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function main() {
  console.log("====================================================");
  console.log("🛰️  Deploying Bazaria Escrow Vault to Polygon Amoy...");
  console.log("====================================================");

  const bazTokenAddress = process.env.NEXT_PUBLIC_BAZ_TOKEN_ADDRESS;
  
  // Dynamically derive the public key from the private key if needed using direct ethers import
  let signerPublicKey = process.env.SERVER_TX_SIGNER_PUBLIC_KEY;
  if (!signerPublicKey && process.env.SERVER_TX_SIGNER_PRIVATE_KEY) {
    try {
      const pk = process.env.SERVER_TX_SIGNER_PRIVATE_KEY.startsWith("0x") 
        ? process.env.SERVER_TX_SIGNER_PRIVATE_KEY 
        : `0x${process.env.SERVER_TX_SIGNER_PRIVATE_KEY}`;
        
      signerPublicKey = new ethers.Wallet(pk).address;
    } catch (e) {
      console.error("❌ Failed to derive public key from private key string:", e.message);
    }
  }

  console.log(`🔍 DEBUG - BAZ Address Value: [${bazTokenAddress}]`);
  console.log(`🔍 DEBUG - Signer Public Key: [${signerPublicKey}]\n`);

  // Verify variables are loaded successfully
  if (!bazTokenAddress || !signerPublicKey) {
    console.error("❌ Missing required environment configuration variables!");
    console.error("Please ensure your variables or SERVER_TX_SIGNER_PRIVATE_KEY are set.\n");
    process.exit(1); 
  }

  // Use Hardhat's runtime environment (hre) to access the factory instantiator directly
  const BazariaEscrowVault = await hre.ethers.getContractFactory("BazariaEscrowVault");
  
  // Deploy the contract with constructor arguments
  const vault = await BazariaEscrowVault.deploy(bazTokenAddress, signerPublicKey);

  await vault.waitForDeployment();

  console.log(`\n✅ Bazaria Escrow Vault successfully deployed to Amoy!`);
  console.log(`📍 Contract Address: ${await vault.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed during block broadcast:", error);
    process.exit(1);
  });
