// "use client";

// import { useContext, useEffect, useState } from "react";
// import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

// import { Badge } from "@/components/ui/badge";
// import {
//   Card,
//   CardAction,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import { getFactoryContract } from "@/app/lib/contracts"; 
// import { ethers } from "ethers";
// import { DashboardContext } from "@/app/dashboard/page";


// export function SectionCards() {
//   const [vaults, setVaults] = useState([]);
//   const predictionVaultAbi = [
//     {
//       "inputs": [
//         {
//           "internalType": "string",
//           "name": "_question",
//           "type": "string"
//         },
//         {
//           "internalType": "string",
//           "name": "_teamA",
//           "type": "string"
//         },
//         {
//           "internalType": "string",
//           "name": "_teamB",
//           "type": "string"
//         },
//         {
//           "internalType": "string",
//           "name": "_category",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "constructor"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "staker",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "string",
//           "name": "outcome",
//           "type": "string"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "amount",
//           "type": "uint256"
//         }
//       ],
//       "name": "BetPlaced",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "winner",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "amount",
//           "type": "uint256"
//         }
//       ],
//       "name": "Payout",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "funder",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "amount",
//           "type": "uint256"
//         }
//       ],
//       "name": "VaultFunded",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": false,
//           "internalType": "string",
//           "name": "winningOutcome",
//           "type": "string"
//         }
//       ],
//       "name": "VaultResolved",
//       "type": "event"
//     },
//     {
//       "inputs": [],
//       "name": "category",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "claim",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "creator",
//       "outputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "name": "hasClaimed",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "isResolved",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "string",
//           "name": "_outcome",
//           "type": "string"
//         }
//       ],
//       "name": "placeBet",
//       "outputs": [],
//       "stateMutability": "payable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "poolA",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "poolB",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "question",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "string",
//           "name": "_winningOutcome",
//           "type": "string"
//         }
//       ],
//       "name": "resolveVault",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "name": "stakesA",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "name": "stakesB",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "teamA",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "teamB",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "totalPool",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "winningOutcome",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "stateMutability": "payable",
//       "type": "receive"
//     }
//   ]
//   const { refresh } = useContext(DashboardContext);


//   useEffect(() => {
//     fetchVaults();
//   }, [refresh]);

//   async function fetchVaults() {
//     try {
//       if (typeof window === "undefined" || !window.ethereum) {
//         console.error("Ethereum provider not found");
//         return;
//       }

//       const factory = await getFactoryContract();
//       const vaultAddresses = await factory.getAllVaults();

//       const provider = new ethers.BrowserProvider(window.ethereum);

//       const vaultsData = await Promise.all(
//         vaultAddresses.map(async (addr) => {
//           const vault = new ethers.Contract(addr, predictionVaultAbi, provider);
//           const question = await vault.question();
//           const teamA = await vault.teamA();
//           const teamB = await vault.teamB();
//           const category = await vault.category(); // ✅ new
//           const poolA = await vault.poolA();
//           const poolB = await vault.poolB();
//           const total = await vault.totalPool();

//           return {
//             address: addr,
//             question,
//             category,
//             teamA,
//             teamB,
//             poolA: ethers.formatEther(poolA),
//             poolB: ethers.formatEther(poolB),
//             total: ethers.formatEther(total),
//           };
//         })
//       );

//       setVaults(vaultsData);
//       console.log(vaultsData);
//     } catch (err) {
//       console.error("Error fetching vaults:", err);
//     }
//   }

//   return (
//     <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
//       {vaults.map((vault, i) => (
//         <Card key={i} className="@container/card">
//           <CardHeader>
//             <CardDescription>{vault.question}</CardDescription>
//             <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//               {vault.total} BDAG
//             </CardTitle>
//             <CardAction>
//               <Badge variant="outline">
//                 {/* <IconTrendingUp /> */}
//                 {vault.category}
//               </Badge>
//             </CardAction>
//           </CardHeader>
//           <CardFooter className="flex-col items-start gap-1.5 text-sm">
//             <div className="line-clamp-1 flex gap-2 font-medium">
//               {vault.teamA}: {vault.poolA} BDAG <IconTrendingUp className="size-4" />
//             </div>
//             <div className="text-muted-foreground flex gap-2 font-medium">
//               {vault.teamB}: {vault.poolB} BDAG <IconTrendingDown className="size-4" />
//             </div>
//           </CardFooter>
//         </Card>
//       ))}
//     </div>
//   );
// }


"use client";

import { useContext, useEffect, useState } from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFactoryContract } from "@/app/lib/contracts";
import { ethers } from "ethers";
import { DashboardContext } from "@/app/dashboard/page";
import { predictionVaultAbi, predictionVaultsFactoryAbi } from "@/abi/abi";

export function SectionCards() {
  const [vaults, setVaults] = useState([]);
  const [resolving, setResolving] = useState(null);



  const { refresh } = useContext(DashboardContext);

  useEffect(() => {
    fetchVaults();
  }, [refresh]);

  async function fetchVaults() {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        console.error("Ethereum provider not found");
        return;
      }

      const factory = await getFactoryContract();
      const vaultAddresses = await factory.getAllVaults();

      const provider = new ethers.BrowserProvider(window.ethereum);

      const vaultsData = await Promise.all(
        vaultAddresses.map(async (addr) => {
          const vault = new ethers.Contract(addr, predictionVaultAbi, provider);
          const question = await vault.question();
          const teamA = await vault.teamA();
          const teamB = await vault.teamB();
          const category = await vault.category();
          const poolA = await vault.poolA();
          const poolB = await vault.poolB();
          const total = await vault.totalPool();
          const resolved = await vault.isResolved();
          const winningOutcome = resolved ? await vault.winningOutcome() : null;

          return {
            address: addr,
            question,
            category,
            teamA,
            teamB,
            poolA: ethers.formatEther(poolA),
            poolB: ethers.formatEther(poolB),
            total: ethers.formatEther(total),
            resolved,
            winningOutcome,
          };
        })
      );

      setVaults(vaultsData);
    } catch (err) {
      console.error("Error fetching vaults:", err);
    }
  }

  async function resolveVault(address, outcome) {
    try {
      if (!window.ethereum) return alert("No wallet found");
      setResolving(address);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const vault = new ethers.Contract(address, predictionVaultAbi, signer);

      const tx = await vault.resolveVault(outcome);
      await tx.wait();

      alert(`Vault resolved with outcome: ${outcome}`);
      fetchVaults(); // refresh list
    } catch (err) {
      console.error("Resolve error:", err);
      alert("Failed to resolve vault");
    } finally {
      setResolving(null);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {vaults.map((vault, i) => (
        <Card key={i} className="@container/card">
          <CardHeader>
            <CardDescription>{vault.question}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {vault.total} BDAG
            </CardTitle>
            <CardAction>
              <Badge variant="outline">{vault.category}</Badge>
            </CardAction>
          </CardHeader>

          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium">
              {vault.teamA}: {vault.poolA} BDAG <IconTrendingUp className="size-4" />
            </div>
            <div className="flex gap-2 font-medium text-muted-foreground">
              {vault.teamB}: {vault.poolB} BDAG <IconTrendingDown className="size-4" />
            </div>

            {vault.resolved ? (
              <div className="mt-2 font-semibold text-green-600">
                ✅ Resolved: {vault.winningOutcome}
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => resolveVault(vault.address, vault.teamA)}
                  disabled={resolving === vault.address}
                  className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Resolve {vault.teamA}
                </button>
                <button
                  onClick={() => resolveVault(vault.address, vault.teamB)}
                  disabled={resolving === vault.address}
                  className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Resolve {vault.teamB}
                </button>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
