

Prediction Vaults – A BlockDAG Hackathon Project
Live Demo: [https://vaults-psi.vercel.app/](https://vaults-psi.vercel.app/)
Pitch Deck: [https://www.canva.com/design/DAG0K6Jeg1Y/5jJV05jaRxUNlq-_Ab5DYg/edit?utm_content=DAG0K6Jeg1Y&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton](https://www.canva.com/design/DAG0K6Jeg1Y/5jJV05jaRxUNlq-_Ab5DYg/edit?utm_content=DAG0K6Jeg1Y&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

-------
Demo Video [https://drive.google.com/file/d/1UxAO3njgB5-w6JDTon4-YTnkaiJWAiLl/view?usp=drive_link](https://drive.google.com/file/d/1UxAO3njgB5-w6JDTon4-YTnkaiJWAiLl/view?usp=drive_link)

---

Overview
Prediction Vaults is a decentralized prediction platform built for the BlockDAG Hackathon.

It enables admins to create on-chain prediction vaults while users participate by making predictions and competing for rewards. The project demonstrates how BlockDAG’s high-throughput, EVM-compatible blockchain can power transparent, real-time dApps.

---

Features

* Vault Factory – admins deploy new vaults directly on BlockDAG testnet.
* Mini-games integration – built-in prediction games for random predictions.
* On-chain transparency – vault states and outcomes stored immutably.
* Reward pools – winners claim vault rewards after they are resolved.
* Fast & scalable – transactions confirmed quickly on BlockDAG.
* Modern UI/UX – sleek, responsive interface built with Next.js + Tailwind.

---

Tech Stack
Frontend / Backend: Next.js
Blockchain Runtime: Hardhat
Smart Contract Interaction: ethers.js
UI Libraries: shadcn/ui, Reactbits, TailwindCSS
AI Assistance: Google GenAI (for ideation/suggestions)
Deployment: Vercel

---

Installation
Clone and run locally:

git clone <your-repo-url>
cd <your-repo-name>
npm install
npm run dev

Runs on [http://localhost:3000/](http://localhost:3000/)

---

Deployment
The project is live here:
[https://vaults-psi.vercel.app/](https://vaults-psi.vercel.app/)

---

Smart Contracts
Vault Factory Address:
0xca9c7C06dCb426f37Ab01Ce8Ba3C83fbB01d32Da

Contracts are deployed on BlockDAG testnet.

---

How to Use

Admin Flow

* Connect your wallet.
* Access the Admin Dashboard.
* Create new prediction vaults, defining:
  • Event or outcome to be predicted
  • Initial balance  – added to the total pool
* Once the event concludes, the admin manually resolves the vault by selecting the correct outcome.
* Rewards can be claimed by participants after the vaults are resolved.

User Flow

* Connect wallet and browse available vaults.
* Select a vault and submit a prediction by staking tokens.
* If the outcome matches the user’s prediction, rewards are credited.

This creates a fair, transparent, on-chain reward system for both admins and users.

---

Development Workflow

1. Smart contracts written, tested, and deployed with Hardhat.
2. Next.js API routes handle backend.
3. ethers.js manages wallet connections and transactions.
4. Unit tests cover key vault mechanics.
5. .env used for sensitive keys; nothing hardcoded.

---

Judging Alignment (BlockDAG Hackathon)

* Technical Excellence – contracts and dApp built with Hardhat + Next.js, fully deployed on BlockDAG testnet.
* Use of BlockDAG Tech – direct deployment on BlockDAG, leveraging its scalability and DAG-based architecture.
* Innovation – a hybrid model of predictions, games, and staking pools.
* Utility – adaptable for sports, finance, markets, and entertainment.
* UI/UX – simple, fast, and responsive dashboard for both admins and users.
* Completeness – end-to-end: contract, frontend, backend, and live deployment delivered.

---

Future Roadmap

* Oracle Integration – replace manual resolution by admin with secure oracle feeds for tamper-proof outcomes.
* DAO Governance – community-driven vault resolution via voting.
* Tokenized Rewards – dedicated reward token for staking, governance, and utility inside the platform.
* Multi-Category Predictions – expand beyond games to sports, markets, and real-world events.
* Cross-Chain Deployment – allow vaults to exist on multiple EVM-compatible networks, with BlockDAG as the settlement layer.
* Enhanced Security – formal verification of contracts and bug bounty programs.

---

License
MIT License

---

Acknowledgements

* BlockDAG for providing the testnet and infrastructure
* Hackathon organizers for the opportunity
* Open-source frameworks and tools that made this project possible

---

Closing Note
Prediction Vaults showcases how prediction markets and reward systems can run seamlessly on BlockDAG.
It highlights the chain’s strengths – speed, scalability, and transparency – while opening the door to new dApps in entertainment, finance, and beyond.

---

Do you want me to also write a **super short version** (like a 1-page README) that’s compact for GitHub judges who just skim, alongside this detailed one?
