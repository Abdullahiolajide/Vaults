require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks:{
    blockdag:{
      url: "https://rpc.primordial.bdagscan.com/",
      chainId: 1043,
      gasPrice: 200000000,
      accounts: [process.env.BLOCKDAG_TESTNET_PRIVATE_KEY]
    }
  },
  solidity: "0.8.28",
};
