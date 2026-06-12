import "dotenv/config";
import "@nomicfoundation/hardhat-ethers";
import ignitionEthers from "@nomicfoundation/hardhat-ignition-ethers";

export default {
  solidity: "0.8.24",
  // Manually injecting the plugin instance into the HRE
  plugins: [ignitionEthers],
  networks: {
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: process.env.AMOY_PRIVATE_KEY ? [process.env.AMOY_PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
};
