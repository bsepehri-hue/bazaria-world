import hre from "hardhat";
import dotenv from "dotenv";

// Explicitly load the local environment variables
dotenv.config({ path: '.env.local' });

async function main() {
  console.log("====================================================");
  console.log("🛰️  Deploying Bazaria Escrow Vault to Polygon Amoy...");
  console.log("====================================================");

  const bazTokenAddress = process.env.NEXT_PUBLIC_BAZ_TOKEN_ADDRESS;
  const signerPublicKey = process.env.SERVER_TX_SIGNER_PUBLIC_KEY;

  console.log("🔍 DEBUG - All Loaded Keys:", Object.keys(process.env).filter(k => k.includes("BAZ") || k.includes("SIGNER") || k.includes("PUBLIC")));
  console.log(`🔍 DEBUG - BAZ Address Value: [${bazTokenAddress}]`);
  console.log(`🔍 DEBUG - Signer Key Value:  [${signerPublicKey}]\n`);

  // Verify variables are loaded successfully
  if (!bazTokenAddress || !signerPublicKey) {
    console.error("❌ Missing required environment configuration variables!");
    console.error("Please define NEXT_PUBLIC_BAZ_TOKEN_ADDRESS and SERVER_TX_SIGNER_PUBLIC_KEY in your .env\n");
    process.exit(1); // Standard Node global exit (typo fixed)
  }

  // Get the contract factory
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
