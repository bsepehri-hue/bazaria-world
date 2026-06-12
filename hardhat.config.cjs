// File: hardhat.config.js
import { defineConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import ignitionEthers from "@nomicfoundation/hardhat-ignition-ethers";
import "dotenv/config";

export default defineConfig({
  solidity: "0.8.24",
  plugins: [ignitionEthers], // Explicitly register the plugin
  networks: {
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: process.env.AMOY_PRIVATE_KEY ? [process.env.AMOY_PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
});
