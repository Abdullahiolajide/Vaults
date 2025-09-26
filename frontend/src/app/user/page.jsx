// 'use client'

// import { useState } from "react"
// import Link from "next/link"

// import { Button } from "@/components/ui/button"
// import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose, DrawerTrigger } from "@/components/ui/drawer"

// const activeQuests = [
//   {
//     id: "btc",
//     title: "Bitcoin Price Prediction",
//     prize: "2.5 ETH",
//     difficulty: "medium",
//     status: "active",
//     description: "Predict if Bitcoin will reach $100,000 by the end of this month",
//     participants: 1247,
//     time: "Ended",
//     prizeBreakdown: ["1.25 ETH", "0.75 ETH", "0.5 ETH"],
//     stats: { total: "2.5 ETH", participants: 1247, positions: 3 },
//   },
//   {
//     id: "eth-merge",
//     title: "Ethereum Merge Impact",
//     prize: "1.8 ETH",
//     difficulty: "hard",
//     status: "active",
//     description: "Will Ethereum's price increase by 25% in the next 30 days post-merge?",
//     participants: 892,
//     time: "Ended",
//     prizeBreakdown: ["1.08 ETH", "0.45 ETH", "0.27 ETH"],
//     stats: { total: "1.8 ETH", participants: 892, positions: 3 },
//   },
//   {
//     id: "stocks",
//     title: "Stock Market Rally",
//     prize: "0.5 ETH",
//     difficulty: "easy",
//     status: "active",
//     description: "Predict if S&P 500 will close above 5000 points this week",
//     participants: 456,
//     time: "Ended",
//     prizeBreakdown: ["0.35 ETH", "0.1 ETH", "0.05 ETH"],
//     stats: { total: "0.5 ETH", participants: 456, positions: 3 },
//   },
// ]

// const upcoming = [
//   {
//     id: "sports",
//     title: "Sports Championship",
//     prize: "3.2 ETH",
//     difficulty: "medium",
//     status: "upcoming",
//     description: "Who will win the upcoming championship game?",
//     participants: 2156,
//     time: "Ended",
//     prizeBreakdown: ["1.28 ETH", "0.9 ETH", "0.64 ETH"],
//   },
// ]

// function StatCard({ label, value, sub }) {
//   return (
//     <Card className="bg-gradient-to-b from-white/5 to-white/0 border-white/10 hover:border-white/20 transition-colors">
//       <CardHeader>
//         <CardDescription className="text-xs text-muted-foreground">{label}</CardDescription>
//         <CardTitle className="text-2xl">{value}</CardTitle>
//         {sub ? <div className="h-2 w-full rounded bg-white/10 overflow-hidden"><div className="h-2 w-[74%] bg-primary transition-all"></div></div> : null}
//       </CardHeader>
//     </Card>
//   )
// }

// function QuestCard({ quest }) {
//   const [open, setOpen] = useState(false)
//   return (
//     <Card className="group relative overflow-hidden border-white/10 hover:border-white/20 transition-all hover:shadow-lg hover:-translate-y-0.5 animate-in fade-in-0 zoom-in-95 h-full flex flex-col">
//       <CardHeader className="flex-1">
//         <div className="flex items-center gap-2 mb-1">
//           <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 capitalize">{quest.difficulty}</Badge>
//           <Badge className="bg-green-500/20 text-green-300 capitalize">{quest.status}</Badge>
//         </div>
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-base">{quest.title}</CardTitle>
//           <div className="text-sm opacity-80">{quest.prize}</div>
//         </div>
//         <CardDescription className="mt-2 text-sm opacity-80">{quest.description}</CardDescription>
//         <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
//           <div className="rounded-md border border-white/10 p-2">
//             <div className="opacity-70">Participants</div>
//             <div className="text-base">{quest.participants}</div>
//           </div>
//           <div className="rounded-md border border-white/10 p-2">
//             <div className="opacity-70">Time Remaining</div>
//             <div className="text-base">{quest.time}</div>
//           </div>
//           <div className="rounded-md border border-white/10 p-2">
//             <div className="opacity-70">Prize</div>
//             <div className="text-base">{quest.prize}</div>
//           </div>
//         </div>
//       </CardHeader>
//       <CardFooter className="pt-0 mt-auto">
//         <Drawer open={open} onOpenChange={setOpen}>
//           <DrawerTrigger asChild>
//             <Button className="w-full transition-transform group-hover:translate-y-[-1px]">Join Prediction</Button>
//           </DrawerTrigger>
//           <DrawerContent className="max-w-2xl mx-auto rounded-t-2xl">
//             <DrawerHeader>
//               <DrawerTitle>{quest.title}</DrawerTitle>
//               <DrawerDescription>{quest.description}</DrawerDescription>
//             </DrawerHeader>
//             <div className="px-4 pb-2">
//               <div className="grid grid-cols-3 gap-3 mb-4">
//                 <Card className="border-white/10">
//                   <CardHeader>
//                     <CardDescription>Total Prize Pool</CardDescription>
//                     <CardTitle className="text-xl">{quest.stats.total}</CardTitle>
//                   </CardHeader>
//                 </Card>
//                 <Card className="border-white/10">
//                   <CardHeader>
//                     <CardDescription>Total Participants</CardDescription>
//                     <CardTitle className="text-xl">{quest.stats.participants}</CardTitle>
//                   </CardHeader>
//                 </Card>
//                 <Card className="border-white/10">
//                   <CardHeader>
//                     <CardDescription>Prize Positions</CardDescription>
//                     <CardTitle className="text-xl">{quest.stats.positions}</CardTitle>
//                   </CardHeader>
//                 </Card>
//               </div>
//               <div className="space-y-2 mb-4">
//                 <div className="font-semibold">Prize Distribution</div>
//                 <div className="rounded-md border border-white/10 p-3 flex items-center justify-between">
//                   <div className="flex items-center gap-2"><span className="inline-block size-3 rounded-full bg-yellow-400"/>1st Place</div>
//                   <div className="opacity-80">{quest.prizeBreakdown[0]}</div>
//                 </div>
//                 <div className="rounded-md border border-white/10 p-3 flex items-center justify-between">
//                   <div className="flex items-center gap-2"><span className="inline-block size-3 rounded-full bg-gray-300"/>2nd Place</div>
//                   <div className="opacity-80">{quest.prizeBreakdown[1]}</div>
//                 </div>
//                 <div className="rounded-md border border-white/10 p-3 flex items-center justify-between">
//                   <div className="flex items-center gap-2"><span className="inline-block size-3 rounded-full bg-amber-700"/>3rd Place</div>
//                   <div className="opacity-80">{quest.prizeBreakdown[2]}</div>
//                 </div>
//               </div>
//               <div className="rounded-md border border-white/10 p-4 text-sm opacity-90">
//                 <div className="font-semibold mb-1">How it works</div>
//                 Make your prediction before the deadline. Winners are determined by accuracy and timing. The more accurate your prediction and the earlier you submit, the better your chances of winning!
//               </div>
//             </div>
//             <DrawerFooter>
//               <Button className="animate-in fade-in-0 duration-300">Make Your Prediction</Button>
//               <Button variant="outline" asChild>
//                 <Link href="#">View Rules</Link>
//               </Button>
//               <DrawerClose asChild>
//                 <Button variant="ghost">Close</Button>
//               </DrawerClose>
//             </DrawerFooter>
//           </DrawerContent>
//         </Drawer>
//       </CardFooter>
//     </Card>
//   )
// }

// export default function Page() {
//   return (
//     <main className="relative min-h-screen text-white p-6 sm:p-10 overflow-hidden">
//       {/* animated background gradients */}
//       <div className="pointer-events-none absolute inset-0 -z-10">
//         <div className="absolute -top-24 -right-32 size-[600px] rounded-full blur-3xl opacity-40 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.45),transparent_60%)] animate-float-slow" />
//         <div className="absolute top-1/3 -left-40 size-[520px] rounded-full blur-3xl opacity-30 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.45),transparent_60%)] animate-float-slower" />
//         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 size-[680px] rounded-full blur-2xl opacity-20 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.45),transparent_60%)] animate-float-slowest" />
//       </div>

//       <div className="max-w-6xl mx-auto space-y-10">
//         <div className="flex items-start justify-between animate-in fade-in-0 slide-in-from-top-2 duration-500">
//           <div>
//             <div className="text-sm opacity-80">Vault Predictions</div>
//             <div className="text-2xl font-semibold">Welcome back, User!</div>
//           </div>
//           <div className="text-right text-sm">
//             <div className="opacity-70">Wallet Balance</div>
//             <div className="font-semibold neon-text">0.245 ETH</div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//           <div className="tilt">
//             <StatCard label="Total Predictions" value="23" />
//           </div>
//           <div className="tilt">
//             <StatCard label="Accuracy Rate" value="74%" sub />
//           </div>
//           <div className="tilt">
//             <StatCard label="Total Earnings" value="2.4 ETH" />
//           </div>
//           <div className="tilt">
//             <StatCard label="#156" value="#156" />
//           </div>
//           <Card className="bg-gradient-to-b from-white/5 to-white/0 border-white/10 tilt">
//             <CardHeader>
//               <CardDescription className="text-xs text-muted-foreground">Active</CardDescription>
//               <CardTitle className="text-2xl">3</CardTitle>
//             </CardHeader>
//           </Card>
//         </div>

//         <div className="flex items-center justify-between">
//           <div className="text-lg font-semibold">Active Prediction Quests</div>
//           <Badge variant="secondary" className="bg-white/10">3 Active</Badge>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
//           {activeQuests.map((q) => (
//             <div key={q.id} className="tilt">
//               <QuestCard quest={q} />
//             </div>
//           ))}
//         </div>

//         <div className="flex items-center justify-between mt-6">
//           <div className="text-lg font-semibold">Upcoming Quests</div>
//           <Badge variant="secondary" className="bg-white/10">1 Coming Soon</Badge>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
//           {upcoming.map((q) => (
//             <Card key={q.id} className="relative overflow-hidden border-white/10 tilt h-full flex flex-col">
//               <CardHeader className="flex-1">
//                 <div className="flex items-center gap-2 mb-1">
//                   <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 capitalize">{q.difficulty}</Badge>
//                   <Badge className="bg-blue-500/20 text-blue-300 capitalize">{q.status}</Badge>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="text-base">{q.title}</CardTitle>
//                   <div className="text-sm opacity-80">{q.prize}</div>
//                 </div>
//                 <CardDescription className="mt-2 text-sm opacity-80">{q.description}</CardDescription>
//                 <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
//                   <div className="rounded-md border border-white/10 p-2">
//                     <div className="opacity-70">Participants</div>
//                     <div className="text-base">{q.participants}</div>
//                   </div>
//                   <div className="rounded-md border border-white/10 p-2">
//                     <div className="opacity-70">Time Remaining</div>
//                     <div className="text-base">{q.time}</div>
//                   </div>
//                   <div className="rounded-md border border-white/10 p-2">
//                     <div className="opacity-70">Prize</div>
//                     <div className="text-base">{q.prize}</div>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardFooter className="mt-auto">
//                 <Button variant="secondary" disabled className="w-full">Coming Soon</Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       </div>

//       <style jsx>{`
//         .neon-text { text-shadow: 0 0 10px rgba(59,130,246,.6), 0 0 20px rgba(59,130,246,.35); }
//         .tilt { transition: transform .35s ease, box-shadow .35s ease; will-change: transform; }
//         .tilt:hover { transform: translateY(-4px) rotate3d(.5,1,0,1.5deg); box-shadow: 0 12px 40px rgba(0,0,0,.35); }
//         @keyframes float-slow { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
//         @keyframes float-slower { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-16px) } }
//         @keyframes float-slowest { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-22px) } }
//         .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
//         .animate-float-slower { animation: float-slower 16s ease-in-out infinite; }
//         .animate-float-slowest { animation: float-slowest 22s ease-in-out infinite; }
//       `}</style>
//     </main>
//   );
// }


// 


// "use client";

// import { useState, useEffect } from "react";
// import { ethers } from "ethers";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerDescription,
//   DrawerClose,
//   DrawerTrigger,
// } from "@/components/ui/drawer";

// // ----------------- CONTRACT CONFIG -----------------
// import { predictionVaultAbi } from "@/abi/abi"; // Vault ABI
// import { predictionVaultsFactoryAbi } from "@/abi/abi"; // Factory ABI

// const FACTORY_ADDRESS =
//   "0x199A7c6e6Fb176F2921cFfeE73eFA6Ec53185402"; // replace with deployed factory

// async function getProvider() {
//   if (!window.ethereum) throw new Error("No wallet found");
//   return new ethers.BrowserProvider(window.ethereum);
// }

// async function getSigner() {
//   const provider = await getProvider();
//   await provider.send("eth_requestAccounts", []);
//   return provider.getSigner();
// }

// async function getVaultFactory() {
//   const signer = await getSigner();
//   return new ethers.Contract(
//     FACTORY_ADDRESS,
//     predictionVaultsFactoryAbi,
//     signer
//   );
// }

// async function getVault(address) {
//   const signer = await getSigner();
//   return new ethers.Contract(address, predictionVaultAbi, signer);
// }

// // ----------------- COMPONENTS -----------------
// function StatCard({ label, value, sub }) {
//   return (
//     <Card className="bg-gradient-to-b from-white/5 to-white/0 border-white/10 hover:border-white/20 transition-colors">
//       <CardHeader>
//         <CardDescription className="text-xs text-muted-foreground">
//           {label}
//         </CardDescription>
//         <CardTitle className="text-2xl">{value}</CardTitle>
//         {sub ? (
//           <div className="h-2 w-full rounded bg-white/10 overflow-hidden">
//             <div className="h-2 w-[74%] bg-primary transition-all"></div>
//           </div>
//         ) : null}
//       </CardHeader>
//     </Card>
//   );
// }

// function QuestCard({ quest }) {
//   const [open, setOpen] = useState(false);

//   async function placeBet() {
//     try {
//       const vault = await getVault(quest.address);
//       const tx = await vault.placeBet("TeamA", {
//         value: ethers.parseEther("0.01"),
//       }); // change outcome + stake as needed
//       await tx.wait();
//       alert("Bet placed!");
//     } catch (err) {
//       console.error(err);
//       alert("Error placing bet");
//     }
//   }

//   async function claimReward() {
//     try {
//       const vault = await getVault(quest.address);
//       const tx = await vault.claim();
//       await tx.wait();
//       alert("Reward claimed!");
//     } catch (err) {
//       console.error(err);
//       alert("Error claiming reward");
//     }
//   }

//   return (
//     <Card className="group relative overflow-hidden border-white/10 hover:border-white/20 transition-all hover:shadow-lg hover:-translate-y-0.5 animate-in fade-in-0 zoom-in-95 h-full flex flex-col">
//       <CardHeader className="flex-1">
//         <div className="flex items-center gap-2 mb-1">
//           <Badge
//             variant="secondary"
//             className="bg-yellow-500/20 text-yellow-300 capitalize"
//           >
//             medium
//           </Badge>
//           <Badge className="bg-green-500/20 text-green-300 capitalize">
//             active
//           </Badge>
//         </div>
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-base">{quest.title}</CardTitle>
//           <div className="text-sm opacity-80 whitespace-nowrap">{quest.prize} BDAG</div>
//         </div>
//         <CardDescription className="mt-2 text-sm opacity-80">
//           {quest.description}
//         </CardDescription>
//         <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
//           <div className="rounded-md border border-white/10 p-2">
//             <div className="opacity-70">Participants</div>
//             <div className="text-base">{quest.participants}</div>
//           </div>
//           <div className="rounded-md border border-white/10 p-2">
//             <div className="opacity-70">Current Pool</div>
//             <div className="text-base">{quest.prize} BDAG</div>
//           </div>
//         </div>
//       </CardHeader>
//       <CardFooter className="pt-0 mt-auto">
//         <Drawer open={open} onOpenChange={setOpen}>
//           <DrawerTrigger asChild>
//             <Button className="w-full text-white cursor-pointer">Join Prediction</Button>
//           </DrawerTrigger>
//           <DrawerContent className="max-w-2xl mx-auto rounded-t-2xl border border-gray-700">
//             <DrawerHeader>
//               <DrawerTitle>{quest.title}</DrawerTitle>
//               <DrawerDescription>{quest.description}</DrawerDescription>
//             </DrawerHeader>
//             <div className="px-4 pb-2">
//               <div className="rounded-md border border-white/10 p-4 text-sm opacity-90">
//                 <div className="font-semibold mb-1">How it works</div>
//                 Stake to join. Winners will be able to claim rewards when
//                 results are declared.
//               </div>
//             </div>
//             <DrawerFooter>
//               <Button onClick={placeBet} className={"text-white"}>Make Your Prediction</Button>
//               <Button variant="secondary" onClick={claimReward}>
//                 Claim Reward
//               </Button>
//               <DrawerClose asChild>
//                 <Button variant="ghost">Close</Button>
//               </DrawerClose>
//             </DrawerFooter>
//           </DrawerContent>
//         </Drawer>
//       </CardFooter>
//     </Card>
//   );
// }

// export default function Page() {
//   const [wallet, setWallet] = useState("");
//   const [balance, setBalance] = useState("0");
//   const [quests, setQuests] = useState([]);

//   useEffect(() => {
//     async function load() {
//       try {
//         const signer = await getSigner();
//         const addr = await signer.getAddress();
//         setWallet(addr);

//         const provider = await getProvider();
//         const bal = await provider.getBalance(addr);
//         setBalance(ethers.formatEther(bal));

//         // Load vaults from factory
//         const factory = await getVaultFactory();
//         const addresses = await factory.getAllVaults();

//         const vaults= [];
//         for (const vaddr of addresses) {
//           const vault = await getVault(vaddr);
//           const title = await vault.question();
//           const prize = ethers.formatEther(await provider.getBalance(vaddr));
//           vaults.push({
//             address: vaddr,
//             title,
//             description: "Prediction market vault",
//             participants: 0,
//             prize,
//           });
//         }
//         setQuests(vaults);
//       } catch (err) {
//         console.error(err);
//       }
//     }
//     load();
//   }, []);

//   return (
//     <main className="relative min-h-screen text-white p-6 sm:p-10 overflow-hidden">
//        <div className="pointer-events-none absolute inset-0 -z-10">
//         <div className="absolute -top-24 -right-32 size-[600px] rounded-full blur-3xl opacity-40 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.45),transparent_60%)] animate-float-slow" />
//          <div className="absolute top-1/3 -left-40 size-[520px] rounded-full blur-3xl opacity-30 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.45),transparent_60%)] animate-float-slower" />
//         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 size-[680px] rounded-full blur-2xl opacity-20 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.45),transparent_60%)] animate-float-slowest" />
//        </div>
//       <div className="max-w-6xl mx-auto space-y-10">
//         <div className="flex items-start justify-between">
//           <div>
//             <div className="text-sm opacity-80">Vault Predictions</div>
//             <div className="text-2xl font-semibold">
//               Welcome back {wallet ? wallet.slice(0, 6) : ""}...
//             </div>
//           </div>
//           <div className="text-right text-sm">
//             <div className="opacity-70">Wallet Balance</div>
//             <div className="font-semibold neon-text">
//               {parseFloat(balance).toFixed(3)} BDAG
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
//           {quests.map((q) => (
//             <div key={q.address} className="tilt">
//               <QuestCard quest={q} />
//             </div>
//           ))}
//         </div>
//       </div>

//       <style jsx>{`
//         .neon-text {
//           text-shadow: 0 0 10px rgba(59, 130, 246, 0.6),
//             0 0 20px rgba(59, 130, 246, 0.35);
//         }
//         .tilt {
//           transition: transform 0.35s ease, box-shadow 0.35s ease;
//           will-change: transform;
//         }
//         .tilt:hover {
//           transform: translateY(-4px) rotate3d(0.5, 1, 0, 1.5deg);
//           box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
//         }
//       `}</style>
//     </main>
//   );
// }


"use client";

import { useState, useEffect } from "react";
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
function QuestCard({ quest, wallet }) {
  const [open, setOpen] = useState(false);
  const [betAmount, setBetAmount] = useState("0.01");
  
  async function placeBet(outcome) {
    
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
    }
  }
  
  async function claimReward() {
    try {
      const vault = await getVault(quest.address);
      const tx = await vault.claim();
      await tx.wait();
      alert("Reward claimed!");
    } catch (err) {
      console.error(err);
      alert("Error claiming reward");
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
            <Button className="w-full text-white cursor-pointer">Join / Claim</Button>
          </DrawerTrigger>
          <DrawerContent className="max-w-2xl mx-auto rounded-t-2xl border border-gray-700">
            <DrawerHeader>
              <DrawerTitle>{quest.question}</DrawerTitle>
              <DrawerDescription>
                {quest.teamA} vs {quest.teamB}
              </DrawerDescription>
            </DrawerHeader>

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

export default function Page() {
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState("0");
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(false)
  const [lText, setLText] = useState('')
  
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
  }, []);

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
              {parseFloat(balance).toFixed(3)} ETH
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {quests.map((q) => (
            <div key={q.address} className="tilt">
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
