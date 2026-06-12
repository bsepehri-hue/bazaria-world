import "dotenv/config";
import ignitionEthers from "@nomicfoundation/hardhat-ignition-ethers";

export default {
  solidity: "0.8.24",
  // In Hardhat 3, explicitly registering the plugin object
  plugins: [ignitionEthers],
  networks: {
    amoy: {
      type: 'http',
      url: "https://rpc-amoy.polygon.technology",
      accounts: process.env.AMOY_PRIVATE_KEY ? [process.env.AMOY_PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
};
