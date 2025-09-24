const hre = require("hardhat");

async function main() {
  const PredictionVaultsFactory = await hre.ethers.getContractFactory("PredictionVaultsFactory");
  const factory = await PredictionVaultsFactory.deploy();

  console.log("Deploying contract...");
  console.log("Transaction hash:", factory.deploymentTransaction().hash);

  // Wait for the deployment to finish using the updated function.
  await factory.waitForDeployment();
  
  const address = await factory.getAddress();
  console.log("PredictionVaultsFactory deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
