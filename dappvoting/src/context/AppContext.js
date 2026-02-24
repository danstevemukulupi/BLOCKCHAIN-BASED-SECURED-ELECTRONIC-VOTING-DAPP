/*import React, { createContext, useState } from "react";
import { ethers } from "ethers";
import VotingArtifact from "../abi/VotingSystem.json";

// Smart contract address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [wallet, setWallet] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWallet(accounts[0]);

      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(_provider);

      const _signer = _provider.getSigner();
      setSigner(_signer);

      const _contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        VotingArtifact.abi,
        _signer
      );
      setContract(_contract);

      console.log("Wallet connected:", accounts[0]);
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{ wallet, provider, signer, contract, connectWallet }}
    >
      {children}
    </AppContext.Provider>
  );
};
*/
