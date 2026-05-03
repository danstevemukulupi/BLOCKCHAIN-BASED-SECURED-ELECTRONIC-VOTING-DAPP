
# 🗳️ Blockchain-Based Secure E-Voting DApp

## 📌 Project Overview
This project presents a **decentralized electronic voting system** built using blockchain technology. The application ensures **security, transparency, and voter privacy** by leveraging smart contracts on Ethereum.

The system removes reliance on a central authority and provides a **tamper-proof and verifiable voting process**.

---

## 🎯 Features

- Secure voter registration  
- Candidate registration  
- Blockchain-based vote casting  
- Prevention of double voting  
- Transparent vote counting  
- Wallet authentication via MetaMask  
- Decentralized storage using IPFS  

---

## 🧰 Technologies Used

- **Blockchain:** Ethereum  
- **Smart Contracts:** Solidity  
- **Frontend:** React.js  
- **Blockchain Interaction:** Ethers.js  
- **Development Environment:** Hardhat  
- **Wallet:** MetaMask  
- **Storage:** IPFS (Pinata)  
- **Backend:** Node.js  

---

## 🏗️ System Architecture

User → Frontend (React) → MetaMask → Smart Contract → Blockchain  
                                         ↓  
                                        IPFS  

---

## ⚙️ Prerequisites

Ensure the following are installed:

- Node.js  
- MetaMask browser extension  
- Git  
- Testnet Ethereum account (Sepolia recommended)  

---

## 🚀 Running the Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/danstevemukulupi/BLOCKCHAIN-BASED-SECURED-ELECTRONIC-VOTING-DAPP.git

cd BLOCKCHAIN-BASED-SECURED-ELECTRONIC-VOTING-DAPP

## npm install
cd dappvoting && npm install
cd ../backend && npm install

## Start Local blockchain
npx  node hardhat node

## Deploy Smart Contracts (Local)
npx hardhat run scripts/deploy.js --network localhost

## Start Backend Server
cd backend
node server.js

## Start Frontend Application
cd dappvoting
npm start

## Running on Testnet (Sepolia)
Deploy Smart Contracts
npx hardhat run scripts/deploy.js --network sepolia

## Build Frontend
cd dappvoting
npm run build

## Deployment (Render)

Both the frontend and backend are deployed using Render.
Deployment Steps:
Push project to GitHub
Connect repository to Render
Configure environment variables (API keys, RPC URL, etc.)
Deploy backend service
Deploy frontend application
Update frontend configuration to use deployed backend URL

## Testing
Testing was conducted using manual functional testing:

Voter registration verified
Vote casting functionality tested
Double voting prevention confirmed
Results accuracy validated

## Security Features
Smart contract-based validation
Immutable blockchain records
Wallet authentication via MetaMask
Prevention of vote tampering
IPFS hash verification

## Project Structure
/contracts     → Smart contracts  
/scripts       → Deployment scripts  
/dappvoting    → React frontend  
/backend       → Node.js backend 

# Documentation
The full dissertation/report is included in this repository.

#Limitations
Gas fees may affect usability
Requires basic blockchain knowledge
No automated unit testing implemented

# Future Improvements
Integration of automated testing (Mocha/Chai)
Improved user interface
Identity verification system
Scalability enhancements

Author

Dan Steve Mukulupi
BSc (Hons) Software Development

⚠️ Disclaimer

This project is developed for academic purposes only.
Do not use real funds or sensitive data when testing the application.