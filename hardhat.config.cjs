# 1. Update the CJS file that is actually being used by Hardhat
Set-Content -Path .\hardhat.config.cjs -Value @"
require('dotenv').config();

module.exports = {
  solidity: '0.8.24',
  networks: {
    amoy: {
      url: 'https://rpc-amoy.polygon.technology',
      accounts: process.env.AMOY_PRIVATE_KEY ? [process.env.AMOY_PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
};
"@

# 2. Tell git to ignore this file so the 'pull' doesn't overwrite your fix again
git update-index --assume-unchanged hardhat.config.cjs
