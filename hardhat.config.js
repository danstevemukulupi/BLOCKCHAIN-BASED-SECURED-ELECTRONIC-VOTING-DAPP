require("@nomicfoundation/hardhat-toolbox");

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
};
