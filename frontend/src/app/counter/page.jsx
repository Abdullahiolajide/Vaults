'use client'
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Your contract's address and ABI.
const contractAddress = "0xcFa39a907aeF5A87Af27911383dAf760b0BBe725";
const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "count",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
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

// The Chain ID for your BlockDAG network, as seen in your screenshot.
const expectedChainId = 1043;

export default function Counter() {
  const [count, setCount] = useState(0);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        setMessage('Please install MetaMask!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const walletSigner = await provider.getSigner();
      const network = await provider.getNetwork();
      const chainId = parseInt(network.chainId);
      
      console.log(`Connected to network with Chain ID: ${chainId}`);

      if (chainId !== expectedChainId) {
        setMessage('Incorrect network. Switching to BlockDAG...');
        try {
          // Request MetaMask to switch networks
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${expectedChainId.toString(16)}` }],
          });
          // The window will reload due to the event listener, and the new connection will be checked
          return;
        } catch (switchError) {
          // This case handles when the user cancels the switch or the network isn't found
          console.error('Failed to switch network:', switchError);
          setMessage('Please manually switch your wallet to the BlockDAG network!');
          setIsCorrectNetwork(false);
          return;
        }
      }
      setIsCorrectNetwork(true);

      const contractInstance = new ethers.Contract(contractAddress, contractABI, walletSigner);
      
      setSigner(walletSigner);
      setContract(contractInstance);
      setIsWalletConnected(true);

      setMessage('Wallet connected!');
      await getCount(contractInstance);

    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  const getCount = async (contractInstance) => {
    if (!contractInstance) return;

    try {
      setLoading(true);
      setMessage('Fetching count...');
      const currentCount = await contractInstance.count();
      setCount(currentCount.toString());
      setMessage('Count updated!');
    } catch (error) {
      console.error('Error fetching count:', error);
      if (error.code === 'BAD_DATA') {
        setMessage('Error: Could not decode contract data. Check your contract address and network.');
      } else {
        setMessage(`Error fetching count: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const callTransaction = async (funcName) => {
    if (!signer || !contract) {
      setMessage('Please connect your wallet first.');
      return;
    }

    if (!isCorrectNetwork) {
      setMessage('Please switch your wallet to the BlockDAG network!');
      return;
    }

    try {
      setLoading(true);
      setMessage(`Sending ${funcName} transaction...`);
      const tx = await contract[funcName]();
      await tx.wait();
      setMessage(`${funcName} transaction confirmed!`);
      await getCount(contract);
    } catch (error) {
      console.error(`Error with ${funcName}:`, error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add a listener for network changes
    const handleChainChanged = () => {
      window.location.reload();
    };
    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-6">Counter dApp</h1>
        <div className="text-center mb-6">
          <p className="text-lg">Current Count:</p>
          <p className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">{count}</p>
        </div>

        <div className="space-y-4">
          {!isWalletConnected ? (
            <button
              onClick={connectWallet}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Connect Wallet
            </button>
          ) : (
            <>
              <button
                onClick={() => callTransaction("increment")}
                className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                disabled={loading || !isCorrectNetwork}
              >
                {loading ? 'Processing...' : 'Increment (+)'}
              </button>
              <button
                onClick={() => callTransaction("decrement")}
                className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                disabled={loading || !isCorrectNetwork}
              >
                {loading ? 'Processing...' : 'Decrement (-)'}
              </button>
            </>
          )}
        </div>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-500 dark:text-gray-400">{message}</p>
        </div>
      </div>
    </div>
  );
}
