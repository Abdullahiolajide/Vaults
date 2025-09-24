'use client';
import React, { useState, useEffect, useRef } from 'react';
import Page from '../dashboard/page';

// Main application component
export default function AppPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState('connect');

  // Function to connect the wallet
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Get provider and signer
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        // Update state on successful connection
        setAccount(address);
        setIsConnected(true);
        setError('');
        setCurrentPage('dashboard');

      } catch (err) {
        console.error("Connection error:", err);
        setError("Failed to connect wallet. Please ensure MetaMask is unlocked.");
      }
    } else {
      setError("MetaMask or a compatible wallet is not installed.");
    }
  };

  const ConnectPage = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
      <h1 className="text-3xl font-bold text-white mb-6">Welcome to Vault</h1>
      <p className="text-gray-400 mb-8 text-center">
        Connect your wallet to get started with the decentralized prediction platform.
      </p>
      <button
        onClick={connectWallet}
        className="py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        Connect Wallet
      </button>
      {error && <p className="text-red-400 mt-4 text-sm text-center">{error}</p>}
    </div>
  );

//   const Dashboard = () => (
        
        
//   );

  return (
    <>
      {/* Ethers.js CDN for wallet interaction */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.umd.min.js"></script>
      <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        {currentPage === 'connect' && <ConnectPage />}
        {currentPage === 'dashboard' && <Page walletAddress={account}/>}
      </main>
      <style jsx>{`
        /* Global styles */
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </>
  );
}


