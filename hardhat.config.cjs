// hardhat.config.cjs
process.env.HARDHAT_SKIP_NODE_VERSION_CHECK = "1";

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
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      // We will handle your private deployment key string explicitly during the deploy phase script!
      accounts: [], 
      chainId: 80002,
    },
  },
};
