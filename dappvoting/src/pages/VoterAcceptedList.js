import {ethers } from 'ethers';
import VotingArtifact from '../abi/VotingSystem.json';
import Container from 'react-bootstrap/Container';
import React, { useState, useEffect } from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import './VoterAcceptedList.css';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function VoterAcceptedList() {

  const [voterName, setVoterName] = useState('');
  const [voterAge, setVoterAge] = useState('');
  const [voterEmail, setVoterEmail] = useState('');
  const [voterPhone, setVoterPhone] = useState('');
  const [voters, setVoters] = useState([]);
  const [contract, setContract] = useState(null);

  // Fetch registered voters
  const getRegisteredVoters = async () => {
    if (!contract) return;
    try {
      const list = await contract.ListofRegisteredVoters();
      setVoters(list);
    } catch (err) {
      console.error("Error fetching voters:", err);
    }
  };

  // Register Voter
  const registerVoter = async () => {
    //if (!contract || !voterName) return;
    if (!contract || !voterName || !voterAge || !voterEmail || !voterPhone) return;
    try {
      //const tx = await contract.registerVoter(voterName);
      const tx = await contract.registerVoter(voterName, parseInt(voterAge), voterEmail, voterPhone);
      await tx.wait();
      alert(`Voter ${voterName} registered!`);
    
    
      setVoterName('');
      setVoterAge('');
      setVoterEmail('');
      setVoterPhone('');
      getRegisteredVoters();
    } catch (err) {
      console.error("Error registering voter:", err);
    }
  };

// approve voter
const approveVoter = async (voterAddress) => {
  if (!contract) return;
  try {
    const tx = await contract.approveVoter(
      voterAddress,
    "You are approved to vote"
  );
    await tx.wait();

    alert("Voter approved!");

    getRegisteredVoters();
   
  } catch (err) {
    console.error("Error approving voter:", err);
  }
};


// Auto fetch voters & candidates when contract changes
  useEffect(() => {
    const loadContract = async () => {
      try {
        //const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545"); // hardhat local node 

        //const signer = provider.getSigner();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const votigContract = new ethers.Contract(
          contractAddress,
          VotingArtifact.abi,
          signer);

          setContract(votigContract);

          // automatically load voters
          const list = await votigContract.ListofRegisteredVoters();
          setVoters(list);
      } catch (err) {
        console.error("Error loading contract:", err);
      }
    };
    loadContract();
  }, [])

useEffect(() => {
  if(contract) {
    getRegisteredVoters();
  }
}, [contract])


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
            </div>
               
            <br/>
            <br/>
                
                <div  className="App-title">
                  <h1 style={{ color: "purple"}}>Verified Voters</h1>
                  <h5>List of voters who have been verified and approved in the system</h5>
      
                </div>
             <br/>
             <br/>
      
            <div className="admin-container">
              <h3 >Verified Voter Records</h3>
          
              <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Status</th>
              <th>Message</th>
              <th>Decision</th>
            </tr>
          </thead>
      
          <tbody>
            {voters.map((v, index) => (
              <tr key={index}>
                <td>{v.name}</td>
                  <td>{v.votersAddress}</td>
                  <td>{v.status.toString()}</td>
                  <td>{v.message}</td>
                  <td >
                    < span class="check-emoji">✅</span>
                  </td>
                  <td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      
            </div>
      
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
    )
}
export default VoterAcceptedList;