import { ethers } from "ethers";
// import vaultAbi from "./PredictionVault.json";
// import factoryAbi from "./PredictionVaultsFactory.json";

// const VAULT_ADDRESS = "0x95e4d39253e9D3771f86873F9e439AcFc10fBbD8";   // deployed PredictionVault
// deployed PredictionVaultsFactory
import { predictionVaultAbi, predictionVaultsFactoryAbi, FACTORY_ADDRESS } from "@/abi/abi";
  
      

function getProvider() {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error("No wallet found. Please install MetaMask.");
}

// export async function getVaultContract() {
//   const provider = await getProvider();
//   const signer = await provider.getSigner();
//   return new ethers.Contract(VAULT_ADDRESS, vaultAbi, signer);
// }

export async function getFactoryContract() {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  return new ethers.Contract(FACTORY_ADDRESS, predictionVaultsFactoryAbi, signer);
}
