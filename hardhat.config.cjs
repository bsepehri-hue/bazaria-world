import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Explicitly require the plugins using the CommonJS loader
require("@nomicfoundation/hardhat-ignition-ethers");
import "dotenv/config";

export default {
  solidity: "0.8.24",
  networks: {
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: process.env.AMOY_PRIVATE_KEY ? [process.env.AMOY_PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
};
