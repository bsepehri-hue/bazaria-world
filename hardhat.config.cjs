import "dotenv/config";
import "@nomicfoundation/hardhat-ignition-ethers";

export default {
  solidity: "0.8.24",
  // We use this to force the HRE to see the ignition tasks
  plugins: ["@nomicfoundation/hardhat-ignition-ethers"],
  networks: {
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: process.env.AMOY_PRIVATE_KEY ? [process.env.AMOY_PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
};
