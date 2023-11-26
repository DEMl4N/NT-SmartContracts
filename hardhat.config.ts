import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.RPC_SEPOLIA,
      accounts: [process.env.PRIVATE_KEY]
    }
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_APIKEY
  }
};

export default config;
