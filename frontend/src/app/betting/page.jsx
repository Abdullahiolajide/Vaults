'use client'
import { useEffect, useState } from 'react';
import Script from 'next/script';

// This is the address where your smart contract will be deployed.
// You will need to replace this with the actual address after deployment.
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Placeholder Address

// This is the ABI (Application Binary Interface) of your smart contract.
// You will get this from your BlockDAG IDE after compiling your contract.
const contractABI = [
  "function placeBet(string memory _outcome) payable",
  "function resolveBet(string memory _winningTeam)",
  "function teamA() view returns (string)",
  "function teamB() view returns (string)",
  "function getTeamAPool() view returns (uint256)",
  "function getTeamBPool() view returns (uint256)",
  "function isResolved() view returns (bool)",
  "function winningTeam() view returns (string)",
  "function owner() view returns (address)"
]; // Placeholder ABI

// The Chain ID for your BlockDAG network
const expectedChainId = 1043;

export default function App() {
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [ownerAddress, setOwnerAddress] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  // Match State
  const [teamA, setTeamA] = useState("Team A");
  const [teamB, setTeamB] = useState("Team B");
  const [teamAPool, setTeamAPool] = useState(0);
  const [teamBPool, setTeamBPool] = useState(0);
  const [isResolved, setIsResolved] = useState(false);
  const [winningTeam, setWinningTeam] = useState("");

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === "undefined" || typeof window.ethers === "undefined") {
        setMessage('Please install MetaMask and ensure the ethers library is available.');
        return;
      }

      const web3Provider = new window.ethers.BrowserProvider(window.ethereum);
      await web3Provider.send('eth_requestAccounts', []);
      const walletSigner = await web3Provider.getSigner();
      const network = await web3Provider.getNetwork();
      const chainId = parseInt(network.chainId);
      const userAddr = await walletSigner.getAddress();

      console.log(`Connected to network with Chain ID: ${chainId}`);
      
      if (chainId !== expectedChainId) {
        setMessage('Incorrect network. Switching to BlockDAG...');
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${expectedChainId.toString(16)}` }],
          });
          return;
        } catch (switchError) {
          setMessage('Please manually switch your wallet to the BlockDAG network!');
          setIsCorrectNetwork(false);
          return;
        }
      }

      const contractInstance = new window.ethers.Contract(contractAddress, contractABI, walletSigner);
      
      setSigner(walletSigner);
      setContract(contractInstance);
      setIsWalletConnected(true);
      setIsCorrectNetwork(true);
      setUserAddress(userAddr);

      setMessage('Wallet connected!');
      await fetchContractData(contractInstance);

    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  const fetchContractData = async (contractInstance) => {
    if (!contractInstance) return;

    try {
      setLoading(true);
      setMessage('Fetching live data...');
      
      const [teamA_name, teamB_name, a_pool, b_pool, resolved, winning_team, owner_addr] = await Promise.all([
        contractInstance.teamA(),
        contractInstance.teamB(),
        contractInstance.getTeamAPool(),
        contractInstance.getTeamBPool(),
        contractInstance.isResolved(),
        contractInstance.winningTeam(),
        contractInstance.owner()
      ]);

      setTeamA(teamA_name);
      setTeamB(teamB_name);
      setTeamAPool(window.ethers.formatEther(a_pool));
      setTeamBPool(window.ethers.formatEther(b_pool));
      setIsResolved(resolved);
      setWinningTeam(winning_team);
      setOwnerAddress(owner_addr);

      setMessage('Data updated!');
    } catch (error) {
      console.error('Error fetching contract data:', error);
      setMessage(`Error: ${error.message}. Please check the contract address and network.`);
    } finally {
      setLoading(false);
    }
  };

  const placeBet = async (team) => {
    if (!contract || !signer || !betAmount) {
      setMessage('Please connect wallet and enter a bet amount.');
      return;
    }
    if (isResolved) {
      setMessage('Betting is closed for this event.');
      return;
    }
    try {
      setLoading(true);
      setMessage(`Placing bet on ${team}...`);
      
      const betTx = await contract.placeBet(team, {
        value: window.ethers.parseEther(betAmount),
      });

      await betTx.wait();
      setMessage('Bet successfully placed!');
      await fetchContractData(contract);
    } catch (error) {
      console.error('Error placing bet:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resolveBet = async (team) => {
    if (!contract || !signer) {
      setMessage('Please connect wallet.');
      return;
    }
    if (isResolved) {
      setMessage('Event is already resolved.');
      return;
    }
    try {
      setLoading(true);
      setMessage(`Resolving bet with winning team: ${team}...`);

      const resolveTx = await contract.resolveBet(team);

      await resolveTx.wait();
      setMessage('Bet successfully resolved!');
      await fetchContractData(contract);
    } catch (error) {
      console.error('Error resolving bet:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.umd.min.js" strategy="beforeInteractive" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 font-sans">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-lg">
          <h1 className="text-3xl font-bold text-center mb-6">Sports Predictor dApp</h1>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Predict the winner of the upcoming match between {teamA} and {teamB}!</p>
          
          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <div className="text-center flex-1">
              <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{teamA}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Pool</p>
              <p className="text-2xl font-bold mt-1">{parseFloat(teamAPool).toFixed(4)} BDAG</p>
            </div>
            <div className="text-center flex-1">
              <h2 className="text-xl font-semibold text-rose-600 dark:text-rose-400">{teamB}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Pool</p>
              <p className="text-2xl font-bold mt-1">{parseFloat(teamBPool).toFixed(4)} BDAG</p>
            </div>
          </div>

          {isResolved && (
            <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 p-4 rounded-lg mb-6 text-center font-bold">
              The winning team is: {winningTeam}!
            </div>
          )}

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
                <div className="flex flex-col gap-2">
                  <input
                    type="number"
                    placeholder="Enter bet amount (BDAG)"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isResolved}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => placeBet(teamA)}
                      className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50"
                      disabled={loading || isResolved}
                    >
                      Bet on {teamA}
                    </button>
                    <button
                      onClick={() => placeBet(teamB)}
                      className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50"
                      disabled={loading || isResolved}
                    >
                      Bet on {teamB}
                    </button>
                  </div>
                </div>

                {/* Owner-only section for resolving bets */}
                {userAddress && ownerAddress && userAddress.toLowerCase() === ownerAddress.toLowerCase() && (
                  <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-center font-bold text-gray-600 dark:text-gray-300 mb-2">Owner's Panel</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => resolveBet(teamA)}
                        className="flex-1 py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50"
                        disabled={loading || isResolved}
                      >
                        Resolve as {teamA}
                      </button>
                      <button
                        onClick={() => resolveBet(teamB)}
                        className="flex-1 py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50"
                        disabled={loading || isResolved}
                      >
                        Resolve as {teamB}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-500 dark:text-gray-400">{message}</p>
          </div>
        </div>
      </div>
    </>
  );
}
