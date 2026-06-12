import "dotenv/config";
import ignitionEthers from "@nomicfoundation/hardhat-ignition-ethers";

export default {
  solidity: "0.8.24",
  // This array registration is mandatory in Hardhat 3 for plugins
  // to correctly link their tasks to the CLI
  plugins: [ignitionEthers],
  networks: {
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: process.env.AMOY_PRIVATE_KEY ? [process.env.AMOY_PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
};
