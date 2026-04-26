
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
      //  added 1
      //const now = Math.floor(Date.now() / 1000);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const block = await provider.getBlock("latest");
    const now = block.timestamp;


      const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000); 

      // added 2
      console.log("Blockchain NOW:", now);
      console.log("Start:", startTimestamp);
      console.log("Diff (seconds):", startTimestamp - now); 

      // added 3 must be at least 5 minutes in the future 
        if (startTimestamp <= now + 300) {
      alert("Start time must be in the future (based on current blockchain time)");
      return;
    }

    if (endTimestamp <= startTimestamp) {
      alert("End time must be after start time");
      return;
    }



      const tx = await contract.startendVoting(startTimestamp, endTimestamp);
      await tx.wait();
      alert('Election time set successfully!');
    } catch (error) {

      console.error('Error setting election time:', error);
      console.error("REASON:", error.reason);
      console.error("MESSAGE:", error.message);

      // this can be deleted after debugging 
      //console.log("NOW (block):", now);
      //console.log("START:", startTimestamp);
      //console.log("DIFF:", startTimestamp - now);


      alert('Failed to set election time. Please try again.');
    }
  }

    return(

     

      


     <div className="App">
      <div className="topnav">
        <a>
       
            <img src="./pics/MapoVote-nobackground.png" alt="logo" width={150} height={60} />

          </a>
          <h2 style={{ color: "purple" }}>MapoVote</h2>
          <Link to="/">Home</Link>
          <Link to="/administrator-page">Administrator</Link>
          <Link to="/help-infos">Help & Info</Link>
      

           {!walletConnected ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <p>Wallet connected: {account}</p>
        )}

      </div>

      <br/>
      <br/>
          
          <div  className="App-title">
            <h1 style={{ color: "purple"}}>Election Dashboard</h1>

          </div>
 


       <br/>
       <br/>

       <div className="time-date-set">
         
        <div className="time-date-set-container">
          <h3 > Election Time and Date </h3>
      <br/>

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

       </div>

       <div className="admin-container"></div>

       <footer className="footer-final">
      
        <div className='footer-container'>

          <div className='footer-column'>
            <h3 style={{ color: "purple"}}>MapoVote</h3>
            <p>Secure, transparent, and accessible voting for every citizen, empowering democracy through technology.</p>
          </div>
          

          <div className='footer-column'>
            <h3>Resources</h3>
            <h5>How it works</h5>
            <h5>Security & privacy</h5>
            <h5>FAQ</h5>
            <h5>Support Center</h5>
          </div>

          <div className='footer-column'>
            <h1>Legal</h1>
            <h5>Terms of Service</h5>
            <h5>Privacy Policy</h5>
            <h5>Compliance</h5>
            <h5>Cookie Policy</h5>
          </div>

          <div className='footer-column'>
            <h1>Contact Us</h1>
            <h5>Email:
              <a href="mailto:info@mapovote.com">info@mapovote.com</a>
            </h5>
            <h5>Phone: +1 (555) 123-4567</h5>
             <h5>Address: 123 Democracy Lane, Capital City, Country</h5>    
          </div>
        </div>

          <div className='footer-bottom'>
            <p>@ 20026 MapoVote Voting Systems. All rights reserved.</p>
          </div>

      
      </footer>


       </div>
       

    );
} 
export default StartElection;
