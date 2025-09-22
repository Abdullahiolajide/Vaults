// // We require the Hardhat Runtime Environment explicitly here. This is optional
// // but useful for running the script in a standalone fashion through `node <script>`.
// //
// // When running a script with `hardhat run <script>`, you'll find the Hardhat
// // Runtime Environment's members available in the global scope.
// const hre = require("hardhat");

// async function main() {
//   // Hardhat always runs the compile task when running scripts with --compile
//   // or --no-compile, so we should be good to go.

//   // We get the contract to deploy.
//   const Counter = await hre.ethers.getContractFactory("Counter");
//   const counter = await Counter.deploy();

//   // Wait for the deployment to finish using the updated function.
//   await counter.waitForDeployment();

//   console.log("Counter deployed to:", counter.address);
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });


// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running a script with `hardhat run <script>`, you'll find the Hardhat
// Runtime Environment's members available in the global scope.
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

