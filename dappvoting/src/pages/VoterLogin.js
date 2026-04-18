
import { ethers } from 'ethers';
import VotingArtifact from '../abi/VotingSystem.json';
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './VoterLogin.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';
{/*import { uploadToPinata } from '../utils/pinatra';*/}



const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function VoterLogin() {
     const [walletConnected, setWalletConnected] = useState(false);
   
      const [voterName, setVoterName] = useState('');
      const [voterAge, setVoterAge] = useState('');
      const [voterEmail, setVoterEmail] = useState('');
      const [voterPhone, setVoterPhone] = useState('');
      const [voterhomeAddress, setVoterHomeAddress] = useState('');
      const [voternationalId, setVoterNationalId] = useState('');
      const [voters, setVoters] = useState([]);

   
     const [voterPassword, setVoterPassword] = useState('');

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
      const [contract, setContract] = useState(null);
    
      const [searchName, setSearchName] = useState('');
      const [searchAddress, setSearchAddress] = useState('');
      const [searchResult, setSearchResult] = useState([]);
      const [newName, setNewName] = useState(''); 

      const [account, setAccount] = useState("");
      const [loggedIn, setLoggedIn] = useState(false); 
      const [ipfsHash, setIpfsHash] = useState("");

      
      
      {/*const [resolvedCandidates, setResolvedCandidates] = useState([]); 

     // new function to search candidate by address and fetch IPFS data
      const searchCandidate = async () => {
  if (!contract || !searchAddress) return;

  try {
    const result = await contract.findCandidate(searchAddress);

    // fetch from IPFS
    const ipfsData = await axios.get(
      `https://gateway.pinata.cloud/ipfs/${result.ipfsHash}`
    );

    setResolvedCandidates([
      {
        ...result,
        ...ipfsData.data
      }
    ]);

  } catch (err) {
    console.error("Error searching candidate:", err);
  }
};*/}


// end new function

// CONNECT WALLET 
// Connect Wallet
  {/*const connectWallet = async () => {
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
  };*/}


  // testing
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
      await checkVoterStatus(userAddress);

    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  } else {
    alert("Please install MetaMask!");
  }
};

  // end of testing 

  // verification
  const checkVoterStatus = async (address) => {
  try {
    const voter = await contract.voters(address);

    console.log("VOTER DATA:", voter);

    if (voter.status === 1) {
      setLoggedIn(true); // ✅ unlock dashboard
    } else {
      setLoggedIn(false);
      alert("You are not an approved voter yet.");
    }
  } catch (err) {
    console.error("Error checking voter:", err);
  }
}; 

  // verification end 




     

      const handleLogin = (e) => {
        e.preventDefault();
        console.log("Voter Email:", voterEmail, "Voter Password:", voterPassword);
        alert("Voter logged in successfully!");
      };

      {/*const searchCandidate = async () => {
        if (!contract || !searchName || !searchAddress) return;
        try {
          const result = await contract.searchCandidate(searchName, searchAddress);
          setSearchResult(result);
        } catch (err) {
          console.error("Error searching candidate:", err);
        }
      };*/}

  // fetch registereed voters
  const getRegisteredVoters = async () => {
    if (!contract) return;
    try {
      const list = await contract.ListofRegisteredVoters();
      setVoters(list || []);
      console.log("VOTERS RAW RESULT:", list);
      console.log("RAW TYPE:", typeof list);
      console.log("IS ARRAY:", Array.isArray(list));
      console.log("RAW VALUE:", list);
   

    } catch (err) {
      console.error("Error fetching voters:", err);
    }
  };

  // end of registered voters

// Register voter new version with IPFS hash
  const registerVoter = async () => {

    // connect wallet first . the registration won't work if wallet is not connected 
    if (!walletConnected) {
      alert("Please connect your wallet first to register as a voter.");
      return;
    }

    if (!contract || !voterName || !voterAge || !voterEmail || !voterPhone || !voterhomeAddress || !voternationalId ) {
      alert("Please fill in all voter registration fields.");
      return;
    }

    try {
      // Upload voter data to IPFS and get the hash
      const ipfsVoterData = {
        name: voterName,
        age: voterAge,
        email: voterEmail,
        phone: voterPhone,
        address: voterhomeAddress,
        nationalId: voternationalId,
      
      };

      // Upload to IPFS and get the hash
      {/*const ipfsHash = await uploadToPinata(ipfsVoterData);*/}

  const response = await axios.post(
  "http://localhost:5000/upload",
  ipfsVoterData
);

console.log("UPLOAD RESPONSE:", response.data);

// HARD CHECK
if (!response.data || !response.data.IpfsHash) {
  throw new Error("IPFS upload failed or missing IpfsHash");
}

const ipfsHash = response.data.IpfsHash;

console.log("FINAL IPFS HASH:", ipfsHash);

if (typeof ipfsHash !== "string") {
  throw new Error("Invalid IPFS hash type");
}

      

      // Register voter and store only the IPFS hash on blockchain
      const tx = await contract.registerVoter(ipfsHash);
      await tx.wait();
      alert("Registration submitted. Waiting for admin approval in about one hour.");

      setVoterName('');
      setVoterAge('');
      setVoterEmail(''); 
      setVoterPhone('');
      setVoterHomeAddress('');
      setVoterNationalId('');
     

      getRegisteredVoters();
    } catch (err) {
      console.error("Error registering voter:", err);
      alert("Registration failed: " + err.message);
    }
  };


     






   {/*}
      // update candidate information (for testing)
      const updateMyName = async () => {
        if (!contract || !newName) return;
        try {
          const tx = await contract.updateCandidate(newName);
          await tx.wait();
          alert("Updated sucessfully!");
          setNewName('');
          getRegisteredCandidates();
        } catch (err) {
          console.error("Error updating candidate information:", err);
        }
      };

      // register candidate

      const getRegisteredCandidates = async () => {
        if (!contract) return;
        try {
          const list = await contract.ListofRegisteredCandidates();
          setCandidates(list || []);
          console.log("CANDIDATES RAW RESULT:", list);
        } catch (err) {
          console.error("Error fetching candidates:", err);
        }
      };

      const registerCandidate = async () => {
        if (!contract || !candidateName || !candidateAge || !candidateEmail || !candidatePhone || !candidatehomeAddress || !politicalParty || !goalsManifesto || !vision || !experience || !candidatenationalId) return;

        try {
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
          };*/}

          {/*const ipfsHash = await uploadToPinata(ipfsCandidateData);*/}
          
          {/*const response = await axios.post(
            "http://localhost:5000/uploadCandidateData",
            ipfsCandidateData
          );
          const ipfsHash = response.data.IpfsHash;

          const tx = await contract.registerCandidate(ipfsHash);
          await tx.wait();
          alert("Registration submitted. Waiting for admin approval.");

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
        }
      };

      const approveCandidate = async (candidateAddress) => {
        if (!contract) return;
        try {
          const tx = await contract.approveCandidate(
            candidateAddress,
            "You are approved to run for office"
          );
          await tx.wait();
          alert("Candidate approved!");
          getRegisteredCandidates();
        } catch (err) {
          console.error("Error approving candidate:", err);
        }
      };

      const getAcceptedCandidates = async () => {
        if (!contract) return;
        try {
          const list = await contract.ListofAcceptedCandidates();
          setCandidates(list || []);
        } catch (err) {
          console.error("Error fetching accepted candidates:", err);
        }
      };*/}

    // Auto fetch voters & candidates when contract changes
  useEffect(() => {
    if (contract) {
      getRegisteredVoters();
      // getRegisteredCandidates();
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
        <Link to="/voter-profile">Profile</Link>

        <NavDropdown title="Election" id="basic-nav-dropdown">
          <NavDropdown.Item as={Link} to="/election-info">Election Info</NavDropdown.Item>  
          <NavDropdown.Item as={Link} to="/candidate-accepted-list">View Candidates</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/election-info">Election Info</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/vote-info">How To Vote</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/vote-status">Voting Status</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/vote-result">Election Result</NavDropdown.Item> 
          <NavDropdown.Divider />
        </NavDropdown>

        <Link to="/start-voting">Vote</Link>

        {!walletConnected ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ): (
          <p>Wallet connected: {account}</p>

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
            <h2>Voter Login</h2>


            <button onClick={connectWallet} className="btn-login">
              Connect Wallet
            </button>


            {account && <p>Wallet: {account}</p>}
            <p style={{ color: "orange" }}>
              ⚠️ Only approved voters can enter
            </p>
          </div>

          {/* RIGHT - REGISTER */}
          <div className="auth-card">
            <h2>Voter Registration</h2>

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
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
            />
            <input 
              type="number"
              name="age"
              placeholder="Age" 
              value={voterAge}
              onChange={(e) => setVoterAge(e.target.value)}
            />
            <input 
              type="email"
              name="email"
              placeholder="Email" 
              value={voterEmail}
              onChange={(e) => setVoterEmail(e.target.value)}
            />
            <input 
              type="text"
              name="phone"
              placeholder="Phone" 
              value={voterPhone}
              onChange={(e) => setVoterPhone(e.target.value)}
            />
            <input 
              type="text"
              name="address"
              placeholder="Address" 
              value={voterhomeAddress}
              onChange={(e) => setVoterHomeAddress(e.target.value)}
            />
            <input 
              type="text"
              name="nationalId"
              placeholder="National ID" 
              value={voternationalId}
              onChange={(e) => setVoterNationalId(e.target.value)}
            />

            <button 
            className="btn-register"
            onClick={registerVoter}
            >

              Register Voter
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

          <div className="voter-container">
            <h1 style={{ color: "purple" }}>Welcome, Voter!</h1>
            <h5>Your portal for participation in the upcoming general election.</h5>
          </div>

          {/*<div style={{ marginBottom: "30px" }}>
            <h3>Search Candidate</h3>

            <input
              type="text"
              placeholder="Enter Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />

            <input
              type="text"
              placeholder="Enter wallet address"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              style={{ marginRight: "10px", padding: "5px", width: "300px" }}
            />

            <button
              onClick={searchCandidate}
              style={{
                padding: "6px 12px",
                background: "purple",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Search
            </button>
          </div>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {resolvedCandidates.map((c, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "12px",
                  padding: "20px",
                  width: "300px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
                }}
              >
                <h4>{c.name}</h4>
                <p><b>Age:</b> {c.age}</p>
                <p><b>Address:</b> {c.candidatesAddress}</p>
                <p><b>Status:</b> {c.status.toString()}</p>
                <p><b>Party:</b> {c.politicalParty}</p>
                <p><b>Manifesto:</b> {c.goalsManifesto}</p>
                <p><b>Vision:</b> {c.vision}</p>
                <p><b>Experience:</b> {c.experience}</p>
                <p><b>Message:</b> {c.message}</p>

                <input 
                  type="text"
                  placeholder="New IPFS hash"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{ marginRight: "10px", padding: "5px", width: "100%" }}  
                />

                <button 
                  onClick={() => updateMyName()} 
                  style={{
                    marginTop: "10px",
                    background: "blue",
                    color: "white", 
                    padding: "6px",
                    border: "none",
                    borderRadius: "6px",
                    width: "100%",
                    cursor: "pointer"
                  }}
                >
                  Update Name
                </button>
              </div>
            ))}
          </div>*/}

          <div className="voter-content">
          </div>

          <footer className="footer-final">
            <div className='footer-container'>

              <div className='footer-column'>
                <h3 style={{ color: "purple" }}>MapoVote</h3>
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
              <p>@ 2026 MapoVote Voting Systems. All rights reserved.</p>
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

export default VoterLogin;