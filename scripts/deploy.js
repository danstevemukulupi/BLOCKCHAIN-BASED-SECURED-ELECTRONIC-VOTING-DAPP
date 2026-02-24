const hre = require("hardhat");

async function main() {
  // Get the deployer account from Hardhat
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying the contracts with the account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", balance.toString());

  // Get the contract factory for VotingSystem
  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");

  // Deploy contract with constructor argument: election name
  const electionName = "My First Election"; 
  const votingSystem = await VotingSystem.deploy(electionName);

  // Wait for deployment to finish
  await votingSystem.waitForDeployment();

  console.log("VotingSystem contract deployed to:", await votingSystem.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
