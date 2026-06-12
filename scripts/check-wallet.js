const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Hardhat is currently configured to use wallet address:", deployer.address);
}
main();
