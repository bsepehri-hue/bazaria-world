// Import the plugin as an object
const ignitionEthersPlugin = require("@nomicfoundation/hardhat-ignition-ethers");
require("dotenv/config");

module.exports = {
  solidity: "0.8.24",
  // Pass the imported plugin object here
  plugins: [ignitionEthersPlugin],
  networks: {
    amoy: {
      type: 'http',
      url: "https://rpc-amoy.polygon.technology",
      accounts: process.env.AMOY_PRIVATE_KEY ? [process.env.AMOY_PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
};
