const hre = require("hardhat");

async function main() {
  console.log("====================================================");
  console.log("🛰️ Deploying Bazaria Escrow Vault to Polygon Amoy...");
  console.log("====================================================");

  // 🪙 Pulling your existing token parameters from your environment setup
  // Ensure these variables are populated in your local .env file
  const BAZ_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_BAZ_TOKEN_ADDRESS; 
  const PLATFORM_SIGNER_ADDRESS = process.env.SERVER_TX_SIGNER_PUBLIC_KEY;

  if (!BAZ_TOKEN_ADDRESS || !PLATFORM_SIGNER_ADDRESS) {
    console.error("❌ Missing required environment configuration variables!");
    console.log("Please define NEXT_PUBLIC_BAZ_TOKEN_ADDRESS and SERVER_TX_SIGNER_PUBLIC_KEY in your .env");
    process.exit();
  }

  // Fetch the contract factory artifact compiled from BazariaVault.sol
  const BazariaVault = await hre.ethers.getContractFactory("BazariaVault");
  
  console.log(`- BAZ Token Parity Base: ${BAZ_TOKEN_ADDRESS}`);
  console.log(`- Oracle System Signer Auth: ${PLATFORM_SIGNER_ADDRESS}`);
  console.log("Broadcasting transaction matrix...");

  const vault = await BazariaVault.deploy(BAZ_TOKEN_ADDRESS, PLATFORM_SIGNER_ADDRESS);

  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();

  console.log("\n====================================================");
  console.log("🎉 VAULT SECURELY INITIALIZED");
  console.log(`🔒 Contract Address: ${vaultAddress}`);
  console.log("====================================================");
  console.log("Next Step: Copy this address into your Next.js .env as BAZARIA_VAULT_ADDRESS.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed during block broadcast:", error);
    process.exit(1);
  });
