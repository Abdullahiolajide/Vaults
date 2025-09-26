"use client";

import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DashboardContext } from "@/app/dashboard/page";
import { useContext, useState } from "react";
import { ethers } from "ethers";

const factoryAbi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newVaultAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "category",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "initialLiquidity",
          "type": "uint256"
        }
      ],
      "name": "VaultCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "allVaults",
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
        },
        {
          "internalType": "string",
          "name": "_category",
          "type": "string"
        }
      ],
      "name": "createVault",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllVaults",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_vault",
          "type": "address"
        }
      ],
      "name": "getVaultCategory",
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
          "internalType": "address",
          "name": "_creator",
          "type": "address"
        }
      ],
      "name": "getVaultsByCreator",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
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
      "name": "vaultCategory",
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
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "vaultsByCreator",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

const FACTORY_ADDRESS = "0x199A7c6e6Fb176F2921cFfeE73eFA6Ec53185402";

export function NavMain({ items }) {
  const { setRefresh } = useContext(DashboardContext);

  // Modal & form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [category, setCategory] = useState(""); // NEW
  const [liquidity, setLiquidity] = useState(""); // NEW (in ETH/BDAG)
  const [loading, setLoading] = useState(false);

  // Create vault handler
  async function handleCreateVault(e) {
    e.preventDefault();
    try {
      setLoading(true);

      if (!window.ethereum) {
        throw new Error("No wallet/provider found.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const factory = new ethers.Contract(FACTORY_ADDRESS, factoryAbi, signer);

      // Convert liquidity to wei
      const value = liquidity ? ethers.parseEther(liquidity.toString()) : 0n;

      const tx = await factory.createVault(question, teamA, teamB, category, {
        value,
      });

      const receipt = await tx.wait();

      // Try to parse VaultCreated event
      let newVaultAddress = null;
      for (const log of receipt.logs) {
        try {
          const parsed = factory.interface.parseLog(log);
          if (parsed && parsed.name === "VaultCreated") {
            newVaultAddress = parsed.args.newVaultAddress;
            break;
          }
        } catch {
          // ignore unrelated logs
        }
      }

      if (newVaultAddress) {
        alert(`Vault created: ${newVaultAddress}`);
        console.log("VaultCreated event:", newVaultAddress);
      } else {
        alert("Vault created (confirmed), but no VaultCreated event found.");
      }

      setRefresh((prev) => !prev);
      setQuestion("");
      setTeamA("");
      setTeamB("");
      setCategory("");
      setLiquidity("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Create vault error:", err);
      const message = err?.reason || err?.message || "Transaction failed.";
      alert("Error creating vault: " + message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Create"
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90 min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Create Vault</span>
            </SidebarMenuButton>

            <Button size="icon" variant="outline" className="size-8">
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Render vault menu items */}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => !loading && setIsModalOpen(false)}
            />
            <div className="relative bg-black rounded-md shadow-lg w-[min(92%,560px)] p-6">
              <h3 className="text-lg font-semibold mb-4">Create New Vault</h3>

              <form onSubmit={handleCreateVault} className="space-y-3">
                <input
                  type="text"
                  placeholder="Prediction question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                  disabled={loading}
                />

                <input
                  type="text"
                  placeholder="Option / Team A"
                  value={teamA}
                  onChange={(e) => setTeamA(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                  disabled={loading}
                />

                <input
                  type="text"
                  placeholder="Option / Team B"
                  value={teamB}
                  onChange={(e) => setTeamB(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                  disabled={loading}
                />

                {/* <input
                  type="text"
                  placeholder="Category (Sports, Celebrities, etc.)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                  disabled={loading}
                /> */}
                <select required disabled={loading} onChange={(e) => setCategory(e.target.value)}
                 id="type" name="type" className="w-full border px-3 py-2 rounded">
                  <option value="sports" className="text-black">Sports</option>
                  <option value="celebrities" className="text-black">Celebrities</option>
                  <option value="weather" className="text-black">Weather</option>
                  <option value="crypto" className="text-black">Crypto</option>
                  <option value="dollars" className="text-black">Dollars</option>
                </select>


                <input
                  type="number"
                  step="0.01"
                  placeholder="Initial Liquidity (BDAG)"
                  value={liquidity}
                  onChange={(e) => setLiquidity(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  disabled={loading}
                />

                <div className="flex justify-end gap-3 mt-3">
                  <Button
                    variant="outline"
                    onClick={() => !loading && setIsModalOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Vault"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
