import { ethers } from "ethers";

// Your deployed contract address (replace with your BlockDAG contract address)
export const contractAddress = "0xcFa39a907aeF5A87Af27911383dAf760b0BBe725";

// ABI from your Counter contract
export const contractABI = [
  {
    "inputs": [],
    "name": "count",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decrement",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "increment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Replace with your BlockDAG RPC URL
const BLOCKDAG_RPC_URL = "https://rpc.primordial.bdagscan.com"; 

// Helper to get contract instance
export async function getContract() {
  try {
    const provider = new ethers.JsonRpcProvider(BLOCKDAG_RPC_URL);
    const signer = provider.getSigner(); // if you need to sign tx (requires wallet integration)
    return new ethers.Contract(contractAddress, contractABI, provider);
  } catch (error) {
    console.error("Failed to get contract:", error);
  }
}
