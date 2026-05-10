const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const L2BToken = await ethers.getContractFactory("L2BToken");
  const token = await L2BToken.deploy("ListToBid", "L2B", ethers.parseUnits("100000000", 18));

  await token.waitForDeployment();
  console.log("L2BToken deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
