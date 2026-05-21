// hardhat.config.cjs
require("@nomicfoundation/hardhat-toolbox");

// Optional: If you use a .env file later for your private keys, this handles it cleanly
require("dotenv").config({ path: __dirname + "/.env" });

// For immediate testing, you can paste your MetaMask account private key string directly here,
// or set it up inside an environment variable named PRIVATE_KEY
const DEPLOYER_PRIVATE_KEY = process.env.PRIVATE_KEY || "YOUR_METAMASK_PRIVATE_KEY_HERE";

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      // Safe check: Only feed the private key array to Hardhat if a real key is present
      accounts: DEPLOYER_PRIVATE_KEY && DEPLOYER_PRIVATE_KEY !== "YOUR_METAMASK_PRIVATE_KEY_HERE" 
        ? [DEPLOYER_PRIVATE_KEY] 
        : [],
      chainId: 80002,
    },
  },
};
