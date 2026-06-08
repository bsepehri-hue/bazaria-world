import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Explicitly load the local environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function main() {
  console.log("====================================================");
  console.log("🛰️  Deploying Bazaria Escrow Vault to Polygon Amoy...");
  console.log("====================================================");

  const bazTokenAddress = process.env.NEXT_PUBLIC_BAZ_TOKEN_ADDRESS;
  const amoyRpcUrl = process.env.NEXT_PUBLIC_AMOY_RPC_URL;
  const deployerPrivateKey = process.env.SERVER_TX_SIGNER_PRIVATE_KEY;

  // 1. Verify environment prerequisites
  if (!bazTokenAddress || !amoyRpcUrl || !deployerPrivateKey) {
    console.error("❌ Missing required configuration variables inside your environment!");
    console.error("Ensure NEXT_PUBLIC_BAZ_TOKEN_ADDRESS, NEXT_PUBLIC_AMOY_RPC_URL, and SERVER_TX_SIGNER_PRIVATE_KEY are active.\n");
    process.exit(1);
  }

  // 2. Set up the standalone Ethers provider and wallet instance
  const provider = new ethers.JsonRpcProvider(amoyRpcUrl);
  
  const formattedPrivateKey = deployerPrivateKey.startsWith("0x") 
    ? deployerPrivateKey 
    : `0x${deployerPrivateKey}`;
    
  const wallet = new ethers.Wallet(formattedPrivateKey, provider);
  const signerPublicKey = wallet.address;

  console.log(`📍 Deployer / Signer Address: [${signerPublicKey}]`);
  console.log(`🪙  Target BAZ Token Address: [${bazTokenAddress}]\n`);

  // 3. Manually resolve the compiled Hardhat contract artifact path
  // UPDATED: Points exactly to your confirmed BazariaMarketplace build output
  const artifactPath = path.resolve(
    "./artifacts/contracts/BazariaMarketplace.sol/BazariaMarketplace.json"
  );

  if (!fs.existsSync(artifactPath)) {
    console.error(`❌ Compiled artifact not found at path: ${artifactPath}`);
    process.exit(1);
  }

  const rawArtifact = fs.readFileSync(artifactPath, "utf8");
  const contractArtifact = JSON.parse(rawArtifact);

  console.log("⚡ Artifacts loaded successfully. Broadcasting block transaction to Amoy network...");

  // 4. Create standard Ethers ContractFactory manually using the loaded ABI/Bytecode
  const factory = new ethers.ContractFactory(
    contractArtifact.abi,
    contractArtifact.bytecode,
    wallet
  );

  // 5. Deploy with your explicit constructor arguments
 const vault = await factory.deploy();
  
  // Wait for the block mining verification confirmation
  await vault.waitForDeployment();

  const deployedAddress = await vault.getAddress();
  console.log(`\n✅ Bazaria Marketplace successfully deployed to Amoy!`);
  console.log(`🚀 Contract Address: ${deployedAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed during block broadcast:", error);
    process.exit(1);
  });
