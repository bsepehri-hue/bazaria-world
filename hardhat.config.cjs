import 'dotenv/config';

export default {
  solidity: '0.8.24',
  networks: {
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      chainId: 80002,
      // Removed 'type' entirely
      accounts: process.env.AMOY_PRIVATE_KEY ? [process.env.AMOY_PRIVATE_KEY] : [],
    },
  },
};
