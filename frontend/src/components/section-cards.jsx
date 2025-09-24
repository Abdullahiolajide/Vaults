// import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

// import { Badge } from "@/components/ui/badge"
// import {
//   Card,
//   CardAction,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"

// export function SectionCards() {
//   return (
//     <div
//       className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
//       <Card className="@container/card">
//         <CardHeader>
//           <CardDescription>Total Revenue</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             $1,250.00
//           </CardTitle>
//           <CardAction>
//             <Badge variant="outline">
//               <IconTrendingUp />
//               +12.5%
//             </Badge>
//           </CardAction>
//         </CardHeader>
//         <CardFooter className="flex-col items-start gap-1.5 text-sm">
//           <div className="line-clamp-1 flex gap-2 font-medium">
//             Trending up this month <IconTrendingUp className="size-4" />
//           </div>
//           <div className="text-muted-foreground">
//             Visitors for the last 6 months
//           </div>
//         </CardFooter>
//       </Card>
//       <Card className="@container/card">
//         <CardHeader>
//           <CardDescription>New Customers</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             1,234
//           </CardTitle>
//           <CardAction>
//             <Badge variant="outline">
//               <IconTrendingDown />
//               -20%
//             </Badge>
//           </CardAction>
//         </CardHeader>
//         <CardFooter className="flex-col items-start gap-1.5 text-sm">
//           <div className="line-clamp-1 flex gap-2 font-medium">
//             Down 20% this period <IconTrendingDown className="size-4" />
//           </div>
//           <div className="text-muted-foreground">
//             Acquisition needs attention
//           </div>
//         </CardFooter>
//       </Card>
//       <Card className="@container/card">
//         <CardHeader>
//           <CardDescription>Active Accounts</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             45,678
//           </CardTitle>
//           <CardAction>
//             <Badge variant="outline">
//               <IconTrendingUp />
//               +12.5%
//             </Badge>
//           </CardAction>
//         </CardHeader>
//         <CardFooter className="flex-col items-start gap-1.5 text-sm">
//           <div className="line-clamp-1 flex gap-2 font-medium">
//             Strong user retention <IconTrendingUp className="size-4" />
//           </div>
//           <div className="text-muted-foreground">Engagement exceed targets</div>
//         </CardFooter>
//       </Card>
//       <Card className="@container/card">
//         <CardHeader>
//           <CardDescription>Growth Rate</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             4.5%
//           </CardTitle>
//           <CardAction>
//             <Badge variant="outline">
//               <IconTrendingUp />
//               +4.5%
//             </Badge>
//           </CardAction>
//         </CardHeader>
//         <CardFooter className="flex-col items-start gap-1.5 text-sm">
//           <div className="line-clamp-1 flex gap-2 font-medium">
//             Steady performance increase <IconTrendingUp className="size-4" />
//           </div>
//           <div className="text-muted-foreground">Meets growth projections</div>
//         </CardFooter>
//       </Card>
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

import { getFactoryContract } from "@/app/lib/contracts"; // <-- factory contract helper
import { ethers } from "ethers";
import { DashboardContext } from "@/app/dashboard/page";
// import predictionVaultAbi from "@/app/lib/PredictionVaultABI.json"; // <-- ABI of PredictionVault

export function SectionCards() {
  const [vaults, setVaults] = useState([]);
  const predictionVaultAbi = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_question",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_teamA",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_teamB",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "staker",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "outcome",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "BetPlaced",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Payout",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "winningOutcome",
          "type": "string"
        }
      ],
      "name": "VaultResolved",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "claim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "creator",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "hasClaimed",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isResolved",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_outcome",
          "type": "string"
        }
      ],
      "name": "placeBet",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "poolA",
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
      "name": "poolB",
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
      "name": "question",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_winningOutcome",
          "type": "string"
        }
      ],
      "name": "resolveVault",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "stakesA",
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
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "stakesB",
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
      "name": "teamA",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "teamB",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalPool",
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
      "name": "winningOutcome",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
  const {refresh} = useContext(DashboardContext)
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

    // ✅ use BrowserProvider in ethers v6
    const provider = new ethers.BrowserProvider(window.ethereum);

    const vaultsData = await Promise.all(
    vaultAddresses.map(async (addr) => {
      const vault = new ethers.Contract(addr, predictionVaultAbi, provider);
      const question = await vault.question();
      const teamA = await vault.teamA();
      const teamB = await vault.teamB();
      const poolA = await vault.poolA();
      const poolB = await vault.poolB();
      return {
        address: addr,
        question,
        teamA,
        teamB,
        poolA: ethers.formatEther(poolA),
        poolB: ethers.formatEther(poolB),
        total: ethers.formatEther(poolA + poolB),
      };
    })
  );


    setVaults(vaultsData);
    console.log(vaultsData)
  } catch (err) {
    console.error("Error fetching vaults:", err);
  }
}

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {vaults.map((vault, i) => (
        <Card key={i} className="@container/card">
          <CardHeader>
            <CardDescription>{vault.question}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {vault.total} BDAG
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {vault.teamA}: {vault.poolA} BDAG <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              {vault.teamB}: {vault.poolB} BDAG
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
