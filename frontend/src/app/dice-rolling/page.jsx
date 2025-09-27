"use client";
import { useState } from "react";

const diceFaces = [
 "/images/dice1.png",
  "/images/dice2.png",
  "/images/dice3.png",
  "/images/dice4.png",
  "/images/dice5.png",
  "/images/dice6.png",
];

export default function DiceGame() {
  const [prediction, setPrediction] = useState("");
  const [lockedPrediction, setLockedPrediction] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(1);
  const [history, setHistory] = useState([]);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  const rollDice = () => {
    if (!prediction) return alert("Pick Even or Odd first!");
    setRolling(true);
    setLockedPrediction(prediction);

    let rollInterval = setInterval(() => {
      setResult(Math.floor(Math.random() * 6) + 1);
    }, 150);

    setTimeout(() => {
      clearInterval(rollInterval);
      const finalRoll = Math.floor(Math.random() * 6) + 1;
      setResult(finalRoll);

      const rollType = finalRoll % 2 === 0 ? "Even" : "Odd";
      const isWin = rollType === prediction;
      const outcome = isWin ? "✅ Correct" : "❌ Loss";

      setHistory((prev) => [
        { prediction, roll: finalRoll, rollType, outcome },
        ...prev, // newest first
      ]);

      if (isWin) setWins((prev) => prev + 1);
      else setLosses((prev) => prev + 1);

      setRolling(false);
    }, 2000);
  };

  const resetGame = () => {
    setHistory([]);
    setWins(0);
    setLosses(0);
    setResult(1);
    setPrediction("");
    setLockedPrediction(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      <h1 className="text-3xl font-bold mb-4">🎲 Dice Roll (Even or Odd)</h1>

      {/* Stats */}
      <div className="flex gap-8 mb-4 text-lg font-semibold">
        <span className="text-green-400">✅ Wins: {wins}</span>
        <span className="text-red-400">❌ Losses: {losses}</span>
      </div>

      {/* Prediction Buttons */}
      <div className="flex gap-4 mb-4">
        {["Even", "Odd"].map((opt) => (
          <button
            key={opt}
            onClick={() => setPrediction(opt)}
            disabled={rolling}
            className={`px-4 py-3 text-sm rounded-lg font-semibold transition ${
              prediction === opt ? "bg-green-600" : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      

      {/* Dice Image */}
      <div className="w-20 h-20 mt-2 mb-4">
        <img
          src={diceFaces[result - 1]}
          alt="Dice"
          className={`w-full h-full ${rolling ? "animate-spin-slow" : ""}`}
        />
      </div>

      {/* Roll & Reset */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={rollDice}
          disabled={rolling}
          className={`px-5 py-3 text-sm font-semibold rounded-xl transition ${
            rolling ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {rolling ? "Rolling..." : "Roll Dice"}
        </button>

        <button
          onClick={resetGame}
          className="px-5 py-2 text-sm font-semibold rounded-xl bg-red-500 hover:bg-red-600 transition"
        >
          Reset
        </button>
      </div>

      {/* Result */}
      {result && !rolling && lockedPrediction && (
        <p className="text-lg font-semibold mt-2">
          🎲 Final Roll: {result} → {result % 2 === 0 ? "Even" : "Odd"} →{" "}
          {lockedPrediction === (result % 2 === 0 ? "Even" : "Odd") ? (
            <span className="text-green-400">✅ Correct</span>
          ) : (
            <span className="text-red-400">❌ Loss</span>
          )}
        </p>
      )}

      {/* History Box */}
      <div className="mt-6 w-90 bg-black/40 p-4 rounded-lg shadow-xl max-h-48 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">📜 History</h2>
        {history.length === 0 ? (
          <p className="text-sm text-gray-300">No predictions yet.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {history.map((h, i) => (
              <li key={i} className="border-b border-white/10 pb-1">
                Predicted <strong>{h.prediction}</strong>, Rolled{" "}
                <strong>{h.roll}</strong> ({h.rollType}) → {h.outcome}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Optional CSS for smooth dice spin */}
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 0.4s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
