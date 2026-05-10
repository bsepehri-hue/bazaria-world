// scripts/deploy-l2b.js
const { ethers } = require("hardhat");

async function main() {
  const name = "ListToBid";
  const symbol = "L2B";
  const initialSupply = ethers.parseUnits("100000000", 18); // 100,000,000 L2B

  const L2BToken = await ethers.getContractFactory("L2BToken");
  const l2b = await L2BToken.deploy(name, symbol, initialSupply);
  await l2b.waitForDeployment();

  console.log("L2B deployed at:", await l2b.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
