
"use client";

import { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerTrigger,
} from "@/components/ui/drawer";

// ----------------- CONTRACT CONFIG -----------------
import { predictionVaultAbi, predictionVaultsFactoryAbi, FACTORY_ADDRESS } from "@/abi/abi";

import { UserContext, useUser } from "./Provider";
import { GoogleGenAI } from "@google/genai";
// import { GoogleGenerativeAI } from "@google/generative-ai";



async function getProvider() {
  if (!window.ethereum) throw new Error("No wallet found");
  return new ethers.BrowserProvider(window.ethereum);
}

async function getSigner() {
  const provider = await getProvider();
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

async function getVaultFactory() {
  const signer = await getSigner();
  return new ethers.Contract(FACTORY_ADDRESS, predictionVaultsFactoryAbi, signer);
}

async function getVault(address) {
  const signer = await getSigner();
  return new ethers.Contract(address, predictionVaultAbi, signer);
}

// ----------------- COMPONENTS -----------------

export function QuestCard({ quest, wallet }) {
  const [open, setOpen] = useState(false);
  const [betAmount, setBetAmount] = useState("0.01");
  const [loading, setLoading] = useState(false)
  const [lText, setLText] = useState('')
  const { setRefresh } = useUser();
  const [AIResponse, setAIResponse] = useState('')
  const [isGen, setIsGen] = useState(false)
  
  async function placeBet(outcome) {
    setLoading(true)
    setLText('Staking...')
    
    try {
      const vault = await getVault(quest.address);
      const tx = await vault.placeBet(outcome, {
        value: ethers.parseEther(betAmount),
      });
      await tx.wait();
      alert(`Bet placed on ${outcome}!`);
    } catch (err) {
      console.error(err);
      alert("Error placing bet");
    }finally{
      setLoading(false)
      setRefresh(prev=> !prev)
      setOpen(false)
      
    }
  }
  
  async function claimReward() {
    setLoading(true)
    setLText('Claiming...')

    try {
      const vault = await getVault(quest.address);
      const tx = await vault.claim();
      await tx.wait();
      alert("Reward claimed!");
    } catch (err) {
      console.error(err);
      alert("Error claiming reward");
    }
    finally{
      setLoading(false)
      setRefresh(prev=> !prev)
    }
  }
  
  async function resolveVault(outcome) {
    try {
      const vault = await getVault(quest.address);
      const tx = await vault.resolveVault(outcome);
      await tx.wait();
      alert(`Vault resolved: ${outcome}`);
    } catch (err) {
      console.error(err);
      alert("Error resolving vault");
    }
  }
  
  // const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

   
      async function askAI(question, first, second) {
        setIsGen(true)
        const resp = await fetch("/api/genai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: `Question: ${question}, which is the likely outcome - ${first} or ${second} just a short sentence, dont be certain about your advise, just an hint, saying wheather it is likely to happen or not` }),
        });
        const data = await resp.json();
        setAIResponse(data.text)
        setIsGen(false)
      // return data.text;
    }


  return (
    <Card className="group relative overflow-hidden border-white/10 hover:border-white/20 transition-all hover:shadow-lg hover:-translate-y-0.5 animate-in fade-in-0 zoom-in-95 h-full flex flex-col">
      
      <CardHeader className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 capitalize">
            {quest.category}
          </Badge>
          <Badge className="bg-green-500/20 text-green-300 capitalize">
            {quest.isResolved ? "resolved" : "active"}
          </Badge>
        </div>
        <CardTitle className="text-base">{quest.question}</CardTitle>
        <CardDescription className="mt-2 text-sm opacity-80">
          {quest.teamA} <span className="text-blue-500 mx-2">vs</span> {quest.teamB}
        </CardDescription>
        <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
          <div className="rounded-md border border-white/10 p-2">
            <div className="opacity-70">Pool A</div>
            <div className="text-base">{quest.poolA} BDAG</div>
          </div>
          <div className="rounded-md border border-white/10 p-2">
            <div className="opacity-70">Pool B</div>
            <div className="text-base">{quest.poolB} BDAG</div>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="pt-0 mt-auto">
        <Drawer open={open} onOpenChange={setOpen}>
        
          <DrawerTrigger asChild>
            <Button className="w-full text-white cursor-pointer">{quest.isResolved ? "Claim" : "Join"}</Button>
          </DrawerTrigger>
          <DrawerContent className="max-w-2xl mx-auto rounded-t-2xl border border-gray-700">
         
            <DrawerHeader>
              <DrawerTitle>{quest.question}</DrawerTitle>
              <DrawerDescription>
                {quest.teamA} vs {quest.teamB}
              </DrawerDescription>
            </DrawerHeader>
                 {loading && 
                  <div className="top-0 left-0 w-full z-100 bg-gray-900/50 fixed h-full w-full z-100 flex items-center justify-center flex flex-col space-y-4">
                    <div className="w-fit flex flex-col items-center rotate z-100">
                      <div className="flex space-x-1">
                        <div className="h-5 w-5 bg-blue-800 rounded-4xl"></div>
                        <div className="h-5 w-5 bg-blue-800 rounded-4xl"></div>
                      </div>
                      <div className="h-5 w-5 bg-blue-800 rounded-4xl"></div>
                    </div>
                    <div className="z-100">{lText}</div>

                  </div>
                }

            <div className="px-4 pb-2 space-y-4">
              <input
                type="text"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full rounded-md border border-white/10 p-2 bg-transparent text-white"
                placeholder="Enter bet amount (BDAG)"
                />

              {!quest.isResolved ? (
                <div className="flex gap-2 flex items-center justify-center">
                  <Button onClick={() => placeBet(quest.teamA)} className={'text-white cursor-pointer'}>Stake on  A</Button>
                  <Button onClick={() => placeBet(quest.teamB)} className={'text-white cursor-pointer'}>Stake on B</Button>
                </div>
              ) : (
                <Button onClick={claimReward} className={'text-white'}>Claim Reward</Button>
              )}

              {/* {wallet.toLowerCase() === quest.creator.toLowerCase() && !quest.isResolved && (
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => resolveVault(quest.teamA)} className={'text-white cursor-pointer'}>
                  Resolve {quest.teamA}
                  </Button>
                  <Button variant="secondary" onClick={() => resolveVault(quest.teamB)} className={'text-white cursor-pointer'}>
                  Resolve {quest.teamB}
                  </Button>
                  </div>
                  )} */}
            </div>
            <div className="px-4 text-sm">
              Not sure what to stake on? <span className="text-blue-600 cursor-pointer hover:text-blue-800" onClick={()=> askAI(quest.question, quest.teamA, quest.teamB)}>Ask AI</span> 
            </div>
            <div className="text-sm px-4 mt-2 duration-300 text-yellow-600">
              {isGen ? 'generating...' : `${AIResponse}`}
            </div>
            <span className="text-xs text-gray-500 text-center">AI predictions are not 100% accurrate</span>

            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="ghost" className={'cursor-pointer'}>Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </CardFooter>
    </Card>
  );
}


export default function Pagee() {
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState("0");
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(false)
  const [lText, setLText] = useState('')
  const {refresh} = useUser()
  
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const signer = await getSigner();
        const addr = await signer.getAddress();
        setWallet(addr);

        const provider = await getProvider();
        const bal = await provider.getBalance(addr);
        setBalance(ethers.formatEther(bal));

        const factory = await getVaultFactory();
        const vaultAddresses = await factory.getAllVaults();

        const vaults = [];
        for (let i = 0; i < vaultAddresses.length; i++) {
          const addr = vaultAddresses[i];
          const vault = await getVault(addr);

          const question = await vault.question();
          const teamA = await vault.teamA();
          const teamB = await vault.teamB();
          const category = await vault.category();
          const poolA = ethers.formatEther(await vault.poolA());
          const poolB = ethers.formatEther(await vault.poolB());
          const creator = await vault.creator();
          const isResolved = await vault.isResolved();

          vaults.push({
            address: addr,
            question,
            teamA,
            teamB,
            category,
            poolA,
            poolB,
            creator,
            isResolved,
          });
        }
        setQuests(vaults);
      } catch (err) {
        console.error(err);
      }
      finally{
        setLoading(false)
      }
    }
    load();
  }, [refresh]);

  return (
    <main className="relative min-h-screen text-white p-6 sm:p-10 overflow-hidden">
      {loading && 
        <div className="top-0 left-0 w-full z-100 bg-gray-900/50 fixed min-h-screen flex items-center justify-center flex flex-col space-y-4">
          <div className="w-fit flex flex-col items-center rotate">
            <div className="flex space-x-1">
              <div className="h-5 w-5 bg-blue-800 rounded-4xl"></div>
              <div className="h-5 w-5 bg-blue-800 rounded-4xl"></div>
            </div>
            <div className="h-5 w-5 bg-blue-800 rounded-4xl"></div>
          </div>
          <div>{lText}</div>

        </div>
          }
      <div className="pointer-events-none absolute inset-0 -z-10">
         <div className="absolute -top-24 -right-32 size-[600px] rounded-full blur-3xl opacity-40 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.45),transparent_60%)] animate-float-slow" />
        <div className="absolute top-1/3 -left-40 size-[520px] rounded-full blur-3xl opacity-30 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.45),transparent_60%)] animate-float-slower" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 size-[680px] rounded-full blur-2xl opacity-20 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.45),transparent_60%)] animate-float-slowest" />
       </div>
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm opacity-80">Vault Predictions</div>
            <div className="text-2xl font-semibold">
              {wallet ? `Welcome back ${wallet.slice(0, 6)}...` : "Connect Wallet"}
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="opacity-70">Wallet Balance</div>
            <div className="font-semibold neon-text">
              {parseFloat(balance).toFixed(3)} BDAG
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {quests.map((q) => (
            <div key={q.address} className={`tilt ${q.isResolved && 'hidden'}`}>
              <QuestCard quest={q} wallet={wallet} />
            </div>
          ))}
        </div>
        <h1 className="font-medium">Resolved Predictions</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {quests.map((q) => (
            <div key={q.address} className={`tilt ${!q.isResolved && 'hidden'}`}>
              <QuestCard quest={q} wallet={wallet} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .neon-text {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.6), 0 0 20px rgba(59, 130, 246, 0.35);
        }
        .tilt {
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          will-change: transform;
        }
        .tilt:hover {
          transform: translateY(-4px) rotate3d(0.5, 1, 0, 1.5deg);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
        }
      `}</style>
    </main>
  );
}
