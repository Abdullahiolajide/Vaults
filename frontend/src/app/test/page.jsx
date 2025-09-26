"use client";
import { useState } from "react";
import { ethers } from "ethers";
// import { getVaultContract, getFactoryContract } from "@/app/lib/contracts";

export default function PredictionApp() {
  const [loading, setLoading] = useState(false);

  async function placeBet(outcome, amountEth) {
    setLoading(true);
    try {
      const vault = await getVaultContract();
      const tx = await vault.placeBet(outcome, {
        value: ethers.parseEther(amountEth),
      });
      await tx.wait();
      alert("Bet placed!");
    } catch (err) {
      console.error(err);
      alert("Failed to place bet");
    }
    setLoading(false);
  }

  async function resolveVault(winningOutcome) {
    try {
      const vault = await getVaultContract();
      const tx = await vault.resolveVault(winningOutcome);
      await tx.wait();
      alert("Vault resolved!");
    } catch (err) {
      console.error(err);
    }
  }

  async function claimWinnings() {
    try {
      const vault = await getVaultContract();
      const tx = await vault.claim();
      await tx.wait();
      alert("Claim successful!");
    } catch (err) {
      console.error(err);
    }
  }

  async function createVault(q, a, b) {
    try {
      const factory = await getFactoryContract();
      const tx = await factory.createVault(q, a, b);
      await tx.wait();
      alert("New vault created!");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <button onClick={() => placeBet("TeamA", "0.01")} disabled={loading}>
        Bet 0.01 ETH on Team A
      </button> <br />
      <br />
      <br />
      <button onClick={() => resolveVault("TeamA")}>
        Resolve (Team A wins)
      </button> <br />
      <button onClick={claimWinnings}>Claim Winnings</button> <br />
      <br />
      <br />
      <button onClick={() => createVault("Who wins?", "TeamA", "TeamB")}>
        Create Vault
      </button>
    </div>
  );
}
