
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import './StartElection.css';

import {ethers } from 'ethers';
import { useState, useEffect } from 'react';
import VotingArtifact from '../abi/VotingSystem.json';

import Button from 'react-bootstrap/Button';
import Label from 'react-bootstrap/FormLabel';
import Form from 'react-bootstrap/Form';


const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function StartElection() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");

  // Connect to MetaMask and set up the contract
 {/* const connectWallet = async () => {
    if (!window.ethereum) {
      alert ("Install MetaMask to use this app!");
      return;

    }

    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts',
    });

    setAccount(accounts[0]);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const votingContract = new ethers.Contract(
      contractAddress,
      VotingArtifact.abi,
      signer
    );

    setContract(votingContract);
  };*/}

  // New Connect to Wallet 
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setWalletConnected(true);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const votingContract = new ethers.Contract(contractAddress, VotingArtifact.abi, signer);
        setContract(votingContract);

        console.log("Wallet connected:", accounts[0]);
      } catch (err) {
        console.error("Error connecting wallet:", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };






  // blockchain timestamp
  const startendVoting = async () => {
    if (!contract) return;

    try {
      const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000); 

      const tx = await contract.startendVoting(startTimestamp, endTimestamp);
      await tx.wait();
      alert('Election time set successfully!');
    } catch (error) {
      console.error('Error setting election time:', error);
      alert('Failed to set election time. Please try again.');
    }
  }

    return(

      <> 

        <Navbar expand = "lg" className='navbarColour'>
      <Container>
        <Navbar.Brand href="#home">Start Election</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="my-center-nav">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/administrator-page">Dashboard</Nav.Link>
            
            {!walletConnected ? (
           <button onClick={connectWallet}>Connect Wallet</button>
           ) : (
           <p>Wallet connected: {account}</p>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    

<div className="container mt-4 candidates-section">
  
      <h1> Set Time and Date of Election </h1>

      

      {/*<Button onClick= {connectWallet}> Connect Admin Wallet</Button>*/}

      <br/><br/>

      <Label>Start Time</Label>
      <input 
      type="datetime-local"
      value={startTime}
      onChange={(e) => setStartTime(e.target.value)}
      />

      <br/><br/>

      <Label>End Time</Label>
      <input 
      type="datetime-local"
      value={endTime}
      onChange={(e) => setEndTime(e.target.value)}
      />

      <br/><br/>

      <button onClick={startendVoting}>Start Election</button>

      </div>

</>

    );
} 
export default StartElection;
