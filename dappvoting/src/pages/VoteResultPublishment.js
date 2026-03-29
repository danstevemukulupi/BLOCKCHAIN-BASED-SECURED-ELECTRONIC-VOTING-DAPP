import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import './VoteResultPublishment.css';

import {ethers } from 'ethers';
import { useState, useEffect } from 'react';
import VotingArtifact from '../abi/VotingSystem.json';

import Button from 'react-bootstrap/Button';
import Label from 'react-bootstrap/FormLabel';
import Form from 'react-bootstrap/Form';


const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function VoteResultPublishment() {

const [walletConnected, setWalletConnected] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");

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

  // Publication time setting
  const setResultPublicationTime = async () => { 
    if (!contract) return;

    try {
        const publicationTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
        const tx = await contract.setResultPublicationTime(publicationTimestamp);
        await tx.wait();
        alert("Result publication time set successfully!");
    } catch (error) {
        console.error('Error setting result publication time:', error);
        alert("Failed to set result publication time. Please try again.");

      }
    }

    return (
        <>
        
        <Navbar expand="lg" className='navbarColour'>
            <Container>
              <Navbar.Brand href="#home"> Result Timer</Navbar.Brand>
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
            <h1>Set Time and Date of Result Publication </h1>

            <br/><br/>

            <Label>Result Time </Label>
            <input 
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            />

            <br/><br/>
            <Button onClick={setResultPublicationTime}>Result Time</Button>

        </div>


        </>
    );
  
}

export default VoteResultPublishment;