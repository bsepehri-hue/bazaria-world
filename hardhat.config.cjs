const ignitionEthers = require("@nomicfoundation/hardhat-ignition-ethers");
require("dotenv/config");

module.exports = {
  solidity: "0.8.24",
  // In Hardhat 3, plugins must be explicitly added to the array
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
