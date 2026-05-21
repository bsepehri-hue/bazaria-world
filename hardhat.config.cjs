require("@nomicfoundation/hardhat-toolbox"); // includes ethers + testing utils

module.exports = {
  solidity: {
    version: "0.8.24", // match your contracts
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
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
