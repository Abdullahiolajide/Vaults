const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with --compile
  // or --no-compile, so we should be good to go.

  // We get the contract to deploy.
  const Counter = await hre.ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();

  console.log("Deploying contract...");
  console.log("Transaction hash:", counter.deploymentTransaction().hash);

  // Wait for the deployment to finish using the updated function.
  await counter.waitForDeployment();
  
  const address = await counter.getAddress();
  console.log("Counter deployed to:", address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

