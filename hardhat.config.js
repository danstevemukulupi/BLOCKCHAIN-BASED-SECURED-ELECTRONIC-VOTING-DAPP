require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // added 1

module.exports = {
  paths: {
    artifacts: "./src/artifacts",
  },
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true
    }
  },

  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // added 2
      accounts: [process.env.PRIVATE_KEY] // added 3
    }, // added4
  }, // added 5
};
