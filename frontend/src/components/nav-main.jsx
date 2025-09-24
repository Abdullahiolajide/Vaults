"use client"

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

/**
 * Factory ABI (only the parts needed: VaultCreated event and createVault)
 * Kept inline so you don't need to import files — replace with your ABI import if you prefer.
 */
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
        }
      ],
      "name": "createVault",
      "outputs": [],
      "stateMutability": "nonpayable",
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

const FACTORY_ADDRESS = "0x95e4d39253e9D3771f86873F9e439AcFc10fBbD8";

export function NavMain({ items }) {
  const { walletAddress } = useContext(DashboardContext);

  // Modal & form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [loading, setLoading] = useState(false);
  const { setRefresh } = useContext(DashboardContext)

  // Create vault handler (calls factory.createVault)
  async function handleCreateVault(e) {
    e.preventDefault();
    try {
      setLoading(true);

      if (!window.ethereum) {
        throw new Error("No wallet/provider found. Please install MetaMask or another wallet.");
      }

      // Request accounts & get signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // ask user to connect if needed
      const signer = await provider.getSigner();

      const factory = new ethers.Contract(FACTORY_ADDRESS, factoryAbi, signer);

      // Call the factory to create a vault
      const tx = await factory.createVault(question, teamA, teamB);
      const receipt = await tx.wait();

      // Try to parse the VaultCreated event from the receipt's logs
      let newVaultAddress = null;
      for (const log of receipt.logs) {
        try {
          const parsed = factory.interface.parseLog(log);
          if (parsed && parsed.name === "VaultCreated") {
            // event signature: (address newVaultAddress, address creator)
            newVaultAddress = parsed.args.newVaultAddress;
            break;
          }
        } catch (err) {
          // parseLog will throw for logs not from this interface - ignore
        }finally{
          setRefresh(prev=> !prev)
        }
      }

      if (newVaultAddress) {
        // success feedback — keep UI unchanged otherwise
        // you can replace the alert with your app toast later
        alert(`Vault created: ${newVaultAddress}`);
        console.log("VaultCreated event address:", newVaultAddress);
      } else {
        // fallback: inform user creation likely succeeded but event wasn't parsed
        alert("Vault created (transaction confirmed). Could not read VaultCreated event from logs.");
        console.log("Receipt logs:", receipt.logs);
      }

      // reset + close modal
      setQuestion("");
      setTeamA("");
      setTeamB("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Create vault error:", err);
      // show friendly message
      const message = err?.reason || err?.message || "Transaction failed or was rejected.";
      alert("Error creating vault: " + message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            {/* KEEP THE SAME UI: only added onClick to open modal */}
            <SidebarMenuButton
              tooltip="Create"
              onClick={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Create Vault</span>
            </SidebarMenuButton>

            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

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

        {/* --- Modal (added, does not replace or remove any existing UI components) --- */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
          >
            {/* overlay */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => {
                if (!loading) setIsModalOpen(false);
              }}
            />

            {/* modal panel */}
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

                <div className="flex items-center justify-end gap-3 mt-3">
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
