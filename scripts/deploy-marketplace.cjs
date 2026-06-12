const hre = require("hardhat");

async function main() {
  console.log("Preparing deployment to Polygon Amoy...");

  // The Polygon Amoy USDC Contract Address
  const usdcAddress = "0x41e94eb019c0762f9bfcf9fb1e58725bfb01728b";

  // Grab the contract factory
  const BazariaMarketplace = await hre.ethers.getContractFactory("BazariaMarketplace");
  
  console.log("Deploying BazariaMarketplace...");
  
  // Deploy the contract, passing the USDC address into the constructor
  const marketplace = await BazariaMarketplace.deploy(usdcAddress);

  // Wait for the deployment to finish
  await marketplace.waitForDeployment();

  const deployedAddress = await marketplace.getAddress();
  console.log(`✅ BazariaMarketplace deployed successfully to: ${deployedAddress}`);
  console.log(`Save this address! You will need it for verification and your Next.js frontend.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
