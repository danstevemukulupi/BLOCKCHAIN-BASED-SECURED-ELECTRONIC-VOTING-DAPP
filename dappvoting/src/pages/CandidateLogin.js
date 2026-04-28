
//import React, { useState, useContext } from "react";
//import { Link } from "react-router-dom";

import {ethers } from "ethers";
import VotingArtifact from '../abi/VotingSystem.json';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import './CandidateLogin.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';


//const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// SEPOLIA ADDRESS
const contractAddress = "0x65F5f54d2E24F9C9B9919D4e3cDe3fBe533D7bD5"

function CandidateLogin() {

  
   const [walletConnected, setWalletConnected] = useState(false);
   const [contract, setContract] = useState(null);

  
   
   const [candidateName, setCandidateName] = useState('');
   const [candidateAge, setCandidateAge] = useState('');
   const [candidateEmail, setCandidateEmail] = useState('');
   const [candidatePhone, setCandidatePhone] = useState('');
   const [candidatehomeAddress, setCandidateHomeAddress] = useState('');
   const [politicalParty, setPoliticalParty] = useState('');
   const [goalsManifesto, setGoalsManifesto] = useState('');
   const [vision, setVision] = useState('');
   const [experience, setExperience] = useState('');
   const [candidatenationalId, setCandidateNationalId] = useState('');
   const [candidates, setCandidates] = useState([]);
   const [candidatePassword, setCandidatePassword] = useState('');

   const [account, setAccount] = useState("");
   const [loggedIn, setLoggedIn] = useState(false); 
   const [ipfsHash, setIpfsHash] = useState("");

   // Connect to MetaMask wallet 
   const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const userAddress = accounts[0];

      setAccount(userAddress);
      setWalletConnected(true);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const votingContract = new ethers.Contract(
        contractAddress,
        VotingArtifact.abi,
        signer
      );

      setContract(votingContract);

      console.log("Wallet connected:", userAddress);

      //  ADD check
      await checkCandidateStatus(userAddress);

    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  } else {
    alert("Please install MetaMask!");
  }
};

// Check if the connected wallet is a registered candidate
const checkCandidateStatus = async (address) => {
  try {
    const candidate = await contract.candidates(address);

    console.log("CANDIDATE DATA:", candidate);

    if (candidate.status === 1) {
      setLoggedIn(true); // ✅ unlock dashboard
    } else {
      setLoggedIn(false);
      alert("You are not an approved candidate yet.");
    }
  } catch (err) {
    console.error("Error checking candidate:", err);
  }
}; 

// Handle candidate login
const handleLogin = (e) => {
        e.preventDefault();
        console.log("Candidate Email:", candidateEmail, "Candidate Password:", candidatePassword);
        alert("Candidate logged in successfully!");
      }; 

  // Fetch Registered Candidates
  const getRegisteredCandidates = async () => {
    if (!contract) return;
    try {
      const list = await contract.ListofRegisteredCandidates();
      setCandidates(list || []);
      console.log("CANDIDATES RAW RESULT:", list);
      console.log("RAW TYPE:", typeof list);
      console.log("IS ARRAY:", Array.isArray(list));
      console.log("RAW VALUE:", list);
   

    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  }; 

  // Register Candidate with IPFS Hash 
  const registerCandidate = async () => {

    // Connect wallet first . the registration won't work if wallet is not connected 
    if (!walletConnected) {
      alert("Please connect your wallet first to register as a candidate.");
      return;
    }

    // Age Validation 
    if (parseInt(candidateAge) < 18) {
      alert("You must be at least 18 years old to register as a candidate.");
      return;
    }

    if (!contract || !candidateName || !candidateAge || !candidateEmail || !candidatePhone || !candidatehomeAddress || !politicalParty  || !goalsManifesto || !vision || !experience || !candidatenationalId ) {
      alert("Please fill in all candidate registration fields.");
      return;
    }

    try {
      // Upload candidate data to IPFS and get the hash
      const ipfsCandidateData = {
        name: candidateName,
        age: candidateAge,
        email: candidateEmail,
        phone: candidatePhone,
        address: candidatehomeAddress,
        politicalParty: politicalParty,
        goalsManifesto: goalsManifesto,
        vision: vision,
        experience: experience,
        nationalId: candidatenationalId,
      
      };

      
      // Hard-Copied IPFs upload Endpoint. Update to IPFS to get real hash.
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, ipfsCandidateData );

console.log("UPLOAD RESPONSE:", response.data);

// Checking if the response contains the expected IPFS hash
if (!response.data || !response.data.IpfsHash) {
  throw new Error("IPFS upload failed or missing IpfsHash");
}

const ipfsHash = response.data.IpfsHash;

console.log("FINAL IPFS HASH:", ipfsHash);

if (typeof ipfsHash !== "string") {
  throw new Error("Invalid IPFS hash type");
}

// Calling the smart contract function to register the candidate with the IPFS hash
const tx = await contract.registerCandidate(ipfsHash);
      await tx.wait();
      alert("Registration submitted. Waiting for admin approval in about one hour.");

      setCandidateName('');
      setCandidateAge('');
      setCandidateEmail(''); 
      setCandidatePhone('');
      setCandidateHomeAddress('');
      setPoliticalParty('');
      setGoalsManifesto('');
      setVision('');
      setExperience('');
      setCandidateNationalId('');
     

      getRegisteredCandidates();
    } catch (err) {
      console.error("Error registering candidate:", err);
      alert("Registration failed: " + err.message);
    }
  };

  // Fetching candidates when contract is ready
  useEffect(() => {
    if (contract) {
      getRegisteredCandidates();
    }
  }, [contract]);

  return (
 
  <div className="App">
    <div className="topnav">
       <a>
            <img src="./pics/MapoVote-nobackground.png" alt="logo" width={150} height={60} />
       </a>
        <h2 style={{ color: "purple" }}>MapoVote</h2>
        <Link to="/">Home</Link>
        {/*<Link to="/candidate-profile">Profile</Link>*/}
        <NavDropdown title="Election" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/election-info">Election Info</NavDropdown.Item>   
              <NavDropdown.Divider />
            </NavDropdown>


        {!walletConnected ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ): (
          <p style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "20px", width: "20px", height: "20px", backgroundColor: "green", borderRadius: "50%", padding: "10px" }}>🟢</p>

        )}  
    </div>

    <br/>
    <br/>

     {!loggedIn ? (

        /* ===================== */
        /* AUTH SCREEN (LOCKED)  */
        /* ===================== */

        <div className="auth-grid">




          <div className="topnav1">
        <a>
          <img src="./pics/MapoVote-nobackground.png" alt="logo" width={150} height={60} />
        </a>
        <h2 style={{ color: "purple" }}>MapoVote</h2>
        <Link to="/">Home</Link>
        
        <NavDropdown title="Election" id="basic-nav-dropdown">
          <NavDropdown.Item as={Link} to="/election-info">Election Info</NavDropdown.Item>  
          <NavDropdown.Item as={Link} to="/vote-info">How To register</NavDropdown.Item>
         
          <NavDropdown.Divider />
        </NavDropdown>

      </div>


          

          {/* LEFT - LOGIN */}
          <div className="auth-card">
            <h2>Candidate Login</h2>


            <button onClick={connectWallet} className="btn-login">
              Connect Wallet

              {account && <p style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", width: "20px", height: "20px", backgroundColor: "green", borderRadius: "50%" }}>🟢</p>}
              
              
            </button>


            
            <p style={{ color: "orange" }}>
              ⚠️ Only approved candidates can enter
            </p>
          </div>

          {/* RIGHT - REGISTER */}
          <div className="auth-card">
            <h2>Candidate Registration</h2>

            {/*connect wallet first before registration. */}
            {!walletConnected ? (
    <div>
      <p style={{ color: "orange" }}>Please connect your wallet first</p>
      <button onClick={connectWallet}>Connect Wallet</button>
    </div>
  ) : (
    <>
            <input 
              type="text"
              name="name"
              placeholder="Name" 
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
            />

            <input 
              type="number"
              name="age"
              placeholder="Age"
              min="18" 
              value={candidateAge}
              onChange={(e) => setCandidateAge(e.target.value)}
            />
             {/* Age Validation */}
            {candidateAge && candidateAge < 18 && ( 
              <p style={{ color: "red", fontSize: "14px" }}>
                ⚠️ You must be 18 or older to register as a candidate.
              </p>
              
            )}

            <input 
              type="email"
              name="email"
              placeholder="Email" 
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
            />

            <input 
              type="text"
              name="phone"
              placeholder="Phone" 
              value={candidatePhone}
              onChange={(e) => setCandidatePhone(e.target.value)}
            />

            <input 
              type="text"
              name="address"
              placeholder="Address" 
              value={candidatehomeAddress}
              onChange={(e) => setCandidateHomeAddress(e.target.value)}
            />


            <input 
              type="text"
              name="politicalParty"
              placeholder="Political Party" 
              value={politicalParty}
              onChange={(e) => setPoliticalParty(e.target.value)}
            />

            <textarea
              name="goalsManifesto"
              placeholder="Goals & Manifesto"
              value={goalsManifesto}
              onChange={(e) => setGoalsManifesto(e.target.value)}
            />

            <textarea
              name="vision"
              placeholder="Vision"
              value={vision}
              onChange={(e) => setVision(e.target.value)}
            />
            
            <textarea
              name="experience"
              placeholder="Experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />

            <input 
              type="text"
              name="nationalId"
              placeholder="National ID" 
              value={candidatenationalId}
              onChange={(e) => setCandidateNationalId(e.target.value)}
            />

            <button 
            className="btn-register"
            onClick={registerCandidate}
            >

              Register Candidate
            </button>
            </>
              )}
          </div>
          

        </div>

      ) : (

        /* ===================== */
        /* DASHBOARD (UNLOCKED)  */
        /* ===================== */


  <div>

    <div className="candidate-container">
      <h1 style={{ color: "purple"}}>Candidate Command Center</h1>
      <h5>Welcome, Candidate! Here you can manage your profile, view election details.</h5>
    </div>
    <br/>
    <br/>
    <br/>
    <br/>
   

     <div className="candidate-content">
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
        /* end dashboard */

      )}
       {/* end ternary */}

      </div>
       /* end App */

  );
}
export default CandidateLogin;