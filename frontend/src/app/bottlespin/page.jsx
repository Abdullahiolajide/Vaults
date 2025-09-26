'use client';
import { useRef, useState } from "react";

const BOTTLE_IMG = "/bottleicon.png";

const BottleSpin = () => {
  const bottleRef = useRef(null);
  const [spinResult, setSpinResult] = useState("");
  const [spinning, setSpinning] = useState(false);
  const currentAngleRef = useRef(0);

  const spinBottle = () => {
    if (spinning) return;
    setSpinning(true);
    const bottle = bottleRef.current;
    // Spin between 3–6 full turns plus random 0–360 stop
    const spins = Math.floor(Math.random() * 3) + 3;
    const randomOffset = Math.floor(Math.random() * 360);
    currentAngleRef.current += spins * 360 + randomOffset;
    if (bottle) {
      bottle.style.transition = "transform 3s cubic-bezier(0.25, 1, 0.5, 1)";
      bottle.style.transform = `rotate(${currentAngleRef.current}deg)`;
    }
    setTimeout(() => {
      // Normalize angle between 0–360
      const normalized = currentAngleRef.current % 360;
      let outcome;
      if (normalized >= 315 || normalized <= 45) {
        outcome = "YES ✅";
      } else if (normalized >= 135 && normalized <= 225) {
        outcome = "NO ❌";
      } else {
        outcome = "🤔 Spin again (sideways)";
      }
      setSpinResult(`Bottle says: ${outcome}`);
      setSpinning(false);
      if (outcome === "YES ✅" || outcome === "NO ❌") {
        autoSubmit(outcome);
      }
    }, 3000);
  };

  function autoSubmit(choice) {
    // 🔗 hook into staking flow here
    console.log("Submitting choice:", choice);
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center"
      style={{
        background: "linear-gradient(to bottom, #0a1128, #000000)",
        color: "rgba(230,230,233,0.95)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Card */}
      <div
        className="flex flex-col justify-between items-center w-full max-w-[400px] rounded-2xl p-6 relative"
        style={{
          minHeight: 420,
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45), 0 0 80px rgba(59,130,246,0.12), 0 0 110px rgba(0,0,0,0.20)",
          backdropFilter: "blur(22px) saturate(140%)",
          WebkitBackdropFilter: "blur(22px) saturate(140%)",
          overflow: "hidden",
          animation: "floatGlow 6s ease-in-out infinite"
        }}
      >
        <div className="text-2xl font-bold my-2" style={{ color: "#3b82f6" }}>YES ✅</div>
        <img
          ref={bottleRef}
          src={BOTTLE_IMG}
          alt="Bottle"
          className="w-[120px]"
          style={{ transition: "transform 3s cubic-bezier(0.25, 1, 0.5, 1)" }}
        />
        <div className="text-2xl font-bold my-2" style={{ color: "#ec4899" }}>NO ❌</div>
      </div>
      {/* Controls */}
      <div className="mt-8 flex flex-col items-center">
        <button
          className="px-6 py-3 text-base font-semibold rounded-xl bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-colors duration-300 shadow-lg cursor-pointer"
          onClick={spinBottle}
          disabled={spinning}
          style={{
            boxShadow: "0 0 24px rgba(59,130,246,0.35) inset, 0 0 24px rgba(59,130,246,0.15)"
          }}
        >
          {spinning ? "Spinning..." : "Spin Bottle 🍾"}
        </button>
        <p className="text-lg mt-4 font-semibold" style={{ color: "#fff", textShadow: "0 0 10px #3b82f6" }}>{spinResult}</p>
      </div>
      {/* Glow animation */}
      <style jsx>{`
        @keyframes floatGlow {
          0% { opacity: 0.6; transform: translate3d(0,0,0) scale(1); }
          50% { opacity: 1; transform: translate3d(0,-8px,0) scale(1.02); }
          100% { transform: translate3d(0,0,0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default BottleSpin;