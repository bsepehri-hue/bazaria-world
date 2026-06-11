import 'dotenv/config';

export default {
  solidity: '0.8.24',
  networks: {
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      type: "http", 
      accounts: process.env.AMOY_PRIVATE_KEY ? [process.env.AMOY_PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
};
