import ignitionEthers from "@nomicfoundation/hardhat-ignition-ethers";
import "dotenv/config";

export default {
  solidity: "0.8.24",
  // This array registration is mandatory for HRE to find the tasks
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
