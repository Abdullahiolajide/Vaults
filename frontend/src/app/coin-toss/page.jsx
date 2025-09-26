'use client';

import { useState } from 'react';

export default function CoinTossPage() {
  const [choice, setChoice] = useState(null);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [total, setTotal] = useState(0);
  const [result, setResult] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState("Heads"); // Track what the coin should show

  const handleChoice = (selectedChoice) => {
    setChoice(selectedChoice);
  };

  const handleToss = () => {
    if (!choice) {
      setResult("Please pick Heads or Tails first!");
      return;
    }

    setIsFlipping(true);
    setResult('');

    setTimeout(() => {
      const toss = Math.random() > 0.5 ? "Heads" : "Tails";
      setCoinResult(toss); // Set the coin to show the actual result
      const isWin = toss === choice;
      
      setResult(
        isWin 
          ? `🎉 Correct! It landed on ${toss}.`
          : `❌ Wrong! It landed on ${toss}.`
      );

      if (isWin) {
        setWins(prev => prev + 1);
      } else {
        setLosses(prev => prev + 1);
      }
      setTotal(prev => prev + 1);
      setIsFlipping(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans">
      <h1 className="text-4xl font-bold mb-5">🪙 Coin Toss Game</h1>

      {/* Choice buttons */}
      <div className="flex gap-4 mb-5">
        <button
          onClick={() => handleChoice("Heads")}
          className={`px-5 py-2.5 rounded-lg font-bold text-base cursor-pointer border-none transition-colors ${
            choice === "Heads" 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-600 text-white hover:bg-gray-500'
          }`}
        >
          Heads
        </button>
        <button
          onClick={() => handleChoice("Tails")}
          className={`px-5 py-2.5 rounded-lg font-bold text-base cursor-pointer border-none transition-colors ${
            choice === "Tails" 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-600 text-white hover:bg-gray-500'
          }`}
        >
          Tails
        </button>
      </div>

      {/* Toss button */}
      <button
        onClick={handleToss}
        className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-bold text-base cursor-pointer border-none hover:bg-green-700 transition-colors"
      >
        Toss Coin
      </button>

      {/* Coin animation */}
      <div className="w-25 h-25 mt-5" style={{ perspective: '1000px' }}>
        <div 
          className={`w-25 h-25 relative transition-transform duration-2000 ${
            isFlipping ? 'animate-spin' : ''
          }`}
          style={{ 
            transformStyle: 'preserve-3d',
            animation: isFlipping ? 'flip 2s forwards' : 'none',
            transform: coinResult === "Tails" ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          <div className="w-25 h-25 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-2xl absolute backface-hidden">
            H
          </div>
          <div 
            className="w-25 h-25 rounded-full bg-gray-400 flex items-center justify-center font-bold text-2xl absolute backface-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            T
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-5 text-xl font-medium">
        {result}
      </div>

      {/* Scoreboard */}
      <div className="mt-8 bg-gray-800 p-4 rounded-lg text-center min-w-48">
        <h3 className="text-xl font-bold mb-3">📊 Scoreboard</h3>
        <p className="mb-2">Wins: {wins}</p>
        <p className="mb-2">Losses: {losses}</p>
        <p>Total Games: {total}</p>
      </div>

      <style jsx>{`
        @keyframes flip {
          0% { transform: rotateY(0); }
          100% { transform: rotateY(1800deg); }
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}