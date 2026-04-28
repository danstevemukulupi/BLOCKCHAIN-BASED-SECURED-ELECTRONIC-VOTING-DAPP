/*import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ADMIN_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

function Administrator() {
  const { wallet, contract, connectWallet } = useContext(AppContext);

  const [isAdmin, setIsAdmin] = useState(false);
  const [voters, setVoters] = useState([]);
  const [candidates, setCandidates] = useState([]);

  // Check admin and fetch data
  const checkAdminAndFetch = useCallback(async () => {
    if (!wallet || !contract) return;

    if (wallet.toLowerCase() !== ADMIN_ADDRESS.toLowerCase()) {
      alert("You are not admin");
      setIsAdmin(false);
      return;
    }

    setIsAdmin(true);

    try {
      const votersList = await contract.ListofRegisteredVoters();
      setVoters(votersList);

      const candidatesList = await contract.ListofRegisteredCandidates();
      setCandidates(candidatesList);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, [wallet, contract]);

  useEffect(() => {
    checkAdminAndFetch();
  }, [checkAdminAndFetch]);

  return (
    <div className="form-container">
      <Link to="/" className="back-link">⬅ Back to Home</Link>
      <h1>Admin Dashboard</h1>

      {!wallet ? (
        <button className="btn" onClick={connectWallet}>Connect MetaMask as Admin</button>
      ) : (
        <p>Admin Wallet: {wallet}</p>
      )}

      {isAdmin && (
        <>
          <h2>Registered Voters</h2>
          <ul>
            {voters.map((v, i) => (
              <li key={i}>{v.name} — {v.votersAddress} — Status: {v.status.toString()}</li>
            ))}
          </ul>

          <h2>Registered Candidates</h2>
          <ul>
            {candidates.map((c, i) => (
              <li key={i}>{c.name} — {c.candidatesAddress} — Status: {c.status.toString()}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}


export default Administrator;
*/
//import React, { useState } from "react";
//import { Link } from "react-router-dom";

import { Modal, Button, Form } from 'react-bootstrap';




import './AdministratorPage.css';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import VotingArtifact from '../abi/VotingSystem.json';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';

import { uploadToPinata } from '../utils/pinatra';
import axios from 'axios';



//const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; LOCAL 
//const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

// SEPOLIA ADDRESS
const contractAddress = "0x65F5f54d2E24F9C9B9919D4e3cDe3fBe533D7bD5"



function AdministratorPage() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);

  const [voterName, setVoterName] = useState('');
  const [voterAge, setVoterAge] = useState('');
  const [voterEmail, setVoterEmail] = useState('');
  const [voterPhone, setVoterPhone] = useState('');
  const [voterhomeAddress, setVoterHomeAddress] = useState('');
  const [voternationalId, setVoterNationalId] = useState('');
 

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
 


  const [voters, setVoters] = useState([]);
  const [candidates, setCandidates] = useState([]);


  // reset election
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetInput, setResetInput] = useState('');


  const [ipfsHash, setIpfsHash] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkedAdmin, setCheckedAdmin] = useState(false);

  const [announcement, setAnnouncement] = useState("");
  const [savedAnnouncement, setSavedAnnouncement] = useState("");

  // Announcement function 
  const saveAnnouncement = async () => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/announcement`,
      { message: announcement }
    );

    setSavedAnnouncement(res.data.message);
    alert("Announcement saved!");
  } catch (err) {
    console.error(err);
  }
};

  // call backend from react to send email notification to voters and candidates when they are approved or rejected by admin
  const sendEmailNotification = async (to, subject, text) => {
    try {
      await axios.post('${process.env.REACT_APP_API_URL}/api/send-email', {
        to,
        subject,
        text
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };


  // Reset Contract Function

  const resetContract = async () => {
    if (!contract || !isAdmin) {
      alert("Only the admin can reset the contract.");
       return;

    }
     

    try {
      const signer = contract.signer;

      // Require wallet re-signn (message signature)
      const message = "Confirm RESET of election data ";
      await signer.signMessage(message);

      // Blockchain Reset
      const tx = await contract.resetContract();
      await tx.wait();

      alert("Contract successfully reset");

      setShowResetModal(false);
      setResetInput('');

      // Refresh UI
      getRegisteredVoters();
      getRegisteredCandidates();

    } catch (err) {
      console.error("Error resetting contract:", err);
      alert("Failed to reset contract."); // added 
    }
  }

  // end of reset contract function

  // Connect Wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAccount = accounts[0]; 


        setAccount(userAccount); 
        //setAccount(accounts[0]);
        setWalletConnected(true);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();

        // network check sepolia
        if (network.chainId !== 11155111) { // Sepolia chain ID
          alert("Please connect to the Sepolia network!");
          return;
        }


        //const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const votingContract = new ethers.Contract(contractAddress, VotingArtifact.abi, signer);
        setContract(votingContract);


        // admin check 
        const owner = await votingContract.owner();

        if (owner.toLowerCase() === userAccount.toLowerCase()) { 
          setIsAdmin(true);
          console.log("✅ Admin connected");
        } else {
          setIsAdmin(false);
          alert("⛔ You are not the admin.");
          
        }

        setCheckedAdmin(true); // Mark that we've checked admin status 
        console.log("Connected account:", userAccount);

        //console.log("Wallet connected:", accounts[0]);
      } catch (err) {
        console.error("Error connecting wallet:", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };




   // Login Link for voters and Candidates

   /*<Router>
    <Routes>
      <Route path="/voter-login" element={<VoterLogin />} />
      <Route path="/candidate-login" element={<CandidateLogin />} />
      <Route path="/administrator-page" element={<administrator />} />
    </Routes>
   </Router>
   */





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

  // Fetch registered candidates
  const getRegisteredCandidates = async () => {
    if (!contract) return;
    try {
      const list = await contract.ListofRegisteredCandidates();
      setCandidates(list);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

  // Register Voter
  /*const registerVoter = async () => {
    //if (!contract || !voterName) return;
    if (!contract || !voterName || !voterAge || !voterEmail || !voterPhone) return;
    try {
      //const tx = await contract.registerVoter(voterName);
      const tx = await contract.registerVoter(voterName, parseInt(voterAge), voterEmail, voterPhone);
      await tx.wait();
      alert(`Voter ${voterName} registered!`);
      //alert(`Voter ${voterAge} registered!`);
      //alert(`Voter ${voterEmail} registered!`);
      //alert(`Voter ${voterPhone} registered!`);
    
      setVoterName('');
      setVoterAge('');
      setVoterEmail('');
      setVoterPhone('');
      getRegisteredVoters();
    } catch (err) {
      console.error("Error registering voter:", err);
    }
  };*/



  // register voter new version with IPFS hash 
  const registerVoter = async () => {
    if (!contract || !voterName || !voterAge || !voterEmail || !voterPhone || !voterhomeAddress || !voternationalId ) return;

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
      const ipfsHash = await uploadToPinata(ipfsVoterData);

      // Register voter and store only the IPFS hash on blockchain
      const tx = await contract.registerVoter(ipfsHash);
      await tx.wait();
      alert("Registration submitted. Waiting for admin approval.");

      setVoterName('');
      setVoterAge('');
      setVoterEmail(''); 
      setVoterPhone('');
      setVoterHomeAddress('');
      setVoterNationalId('');
      

      getRegisteredVoters();
    } catch (err) {
      console.error("Error registering voter:", err);
    }
  };



/*const approveVoter = async (voterAddress) => {
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
};*/

// approve voter with email notification
const approveVoter = async (voterAddress, voterEmail) => {
  const tx = await contract.approveVoter(
    voterAddress,
    "You are approved to vote"
  );
  await tx.wait();

  // Send email notification
  await sendEmailNotification(voterEmail, "Voter Approval", "You have been approved to vote.");
  //alert("Voter approved!");

  getRegisteredVoters();
};





/*const rejectVoter = async (voterAddress) => {
  if (!contract) return;
  try {
    const tx = await contract.rejectVoter(
      voterAddress,
    "You are not approved to vote"

  );
    await tx.wait();

    alert("Voter rejected!");

    getRegisteredVoters();
   
  } catch (err) {
    console.error("Error rejecting voter:", err);
  }
};*/

// reject voter with email notification
const rejectVoter = async (voterAddress, voterEmail) => {
  const tx = await contract.rejectVoter(
    voterAddress,
    "You are not approved to vote"
  );
  await tx.wait();
  // Send email notification
  await sendEmailNotification(voterEmail, "Voter Rejection", "Your voter application has been rejected. Please update your details and try again.");
  //alert("Voter rejected!");
  getRegisteredVoters();
};






const getAcceptedVoters = async () => {
  if (!contract) return;

  try {
    const list = await contract.ListofAcceptedVoters();
    setVoters(list);
  } catch (err) {
    console.error("Error fetching accepted voters:", err);
  }
};


  // Register Candidate
  /*const registerCandidate = async () => {
    if (!contract || !candidateName || !candidateAge || !candidateEmail || !candidatePhone) return;
    //if (!contract || !candidateName ) return;
    try {
      //const tx = await contract.registerCandidate(candidateName);
      const tx = await contract.registerCandidate(candidateName, parseInt(candidateAge), candidateEmail, candidatePhone);
      await tx.wait();
      alert(`Candidate ${candidateName} registered!`);
      //alert(`Candidate ${candidateAge} registered!`);
      //alert(`Candidate ${candidateEmail} registered!`);
      //alert(`Candidate ${candidatePhone} registered!`);

      setCandidateName('');
      setCandidateAge('');
      setCandidateEmail('');
      setCandidatePhone('');
      getRegisteredCandidates();
    } catch (err) {
      console.error("Error registering candidate:", err);
    }
  };*/

  // register candidate new version with IPFS hash
  const registerCandidate = async () => {
    if (!contract || !candidateName || !candidateAge || !candidateEmail || !candidatePhone || !candidatehomeAddress || !politicalParty || !goalsManifesto || !vision || !experience ||  !candidatenationalId ) return;

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

      // Upload to IPFS and get the hash
      const ipfsHash = await uploadToPinata(ipfsCandidateData);

      // Register candidate and store only the IPFS hash on blockchain
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







// approve candidate 
  const approveCandidate = async (candidateAddress) => {
  if (!contract) return;
  try {
    const tx = await contract.approveCandidate(
      candidateAddress,
    "You are approved to run for this election"

  );
    await tx.wait();

    alert("Candidate approved!");

    getRegisteredCandidates();
   
  } catch (err) {
    console.error("Error approving candidate:", err);
  }
};

  // reject candidate
  const rejectCandidate = async (candidateAddress) => {
  if (!contract) return;
  try {
    const tx = await contract.rejectCandidate(
      candidateAddress,
    "You are not approved to run for this election"

  );
    await tx.wait();

    alert("Candidate rejected!");

    getRegisteredCandidates();
   
  } catch (err) {
    console.error("Error rejecting candidate:", err);
  }
};

const getAcceptedCandidates = async () => {
  if (!contract) return;

  try {
    const list = await contract.ListofAcceptedCandidates();
    setCandidates(list);
  } catch (err) {
    console.error("Error fetching accepted candidates:", err);
  }
};


  // Vote
  const voteForCandidate = async (candidateAddress) => {
    if (!contract) return;
    try {
      const tx = await contract.vote(candidateAddress);
      await tx.wait();
      alert(`Vote cast for ${candidateAddress}`);
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  // Auto fetch voters & candidates when contract changes
  useEffect(() => {
    if (contract) {
      getRegisteredVoters();
      getRegisteredCandidates();
    }
  }, [contract]);


// 🚫 Not connected → show request access
if (!walletConnected) {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>🔐 Admin Access Required</h2>
      <p>Please connect your admin wallet to continue.</p>

      <button onClick={connectWallet}>
        Connect Admin Wallet
      </button>
    </div>
  );
}

// 🚫 Connected but not admin → deny
if (walletConnected && checkedAdmin && !isAdmin) {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>⛔ Access Denied</h2>
      <p>This page is restricted to the contract owner.</p>
    </div>
  );
}

// ⏳ Optional: loading state
if (walletConnected && !checkedAdmin) {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <p>Checking admin permissions...</p>
    </div>
  );
}


  return (
    
   

     <div className="App"> 
     
    
    <div className="topnav">
      <a>
            <img src="./pics/MapoVote-nobackground.png" alt="logo" width={150} height={60} />
       </a>
       <h2 style={{ color: "purple" }}>MapoVote</h2>
       <Link to="/">Home</Link>
       <NavDropdown title="Voters " id="basic-nav-dropdown" >
              <NavDropdown.Item as={Link} to="/voter-Registration">List of Registered Voters</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/voter-accepted-list">List of Approved Voters</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/voter-rejected-list">List of Rejected Voters</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Candidates " id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/candidate-Registration">List of Registered Candidates</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/candidate-accepted-list">List of Approved Candidates</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/candidate-rejected-list">List of Rejected Candidates</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/start-election">Start Election</Nav.Link>

             {!walletConnected ? (
           <button onClick={connectWallet}>Connect Wallet</button>
           ) : (
           <p style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto" }}>🟢</p> // display connected wallet <p> connected Wallet {account}</p>
          
            )}

            <button
           className="btn btn-danger"
           onClick={() => setShowResetModal(true)}
           style={{marginTop: "10px", width: "200px", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto"}}
           >

          🗑️ Reset Election
        </button>

            
    </div>
  
    <br/>
    <br/>
    <br/>
    <br/>
     
     <div className="admin-container">
      <h1 style={{ color: "purple", textAlign: "center" }}>Admin Dashboard</h1>
      <h5 style={{ textAlign: "center" }}>Manage voters and candidates, and start the election.</h5>
    </div>

    <div className="voter-stats">

      <div>
        <h5>Total Voters</h5>
        <h5>{voters.length}</h5>
      </div>

      <div>
      <h5>Approved Voters</h5>
      <h5>{voters.filter(v => v.status.toString() === "1").length}</h5>
      </div>
       
      <div>
        <h5>Rejected Voters</h5>
      <h5>{voters.filter(v => v.status.toString() === "2").length}</h5>
      </div>

    </div>

     <div className="candidate-stats">

      <div>
        <h5>Total Candidates</h5>
        <h5>{candidates.length}</h5>
      </div>

      <div>
      <h5>Approved Candidates</h5>
      <h5>{candidates.filter(c => c.status.toString() === "1").length}</h5>
      </div>
       
      <div>
        <h5>Rejected Candidates</h5>
      <h5>{candidates.filter(c => c.status.toString() === "2").length}</h5>
      </div>

    </div>

    <div className="upcomingstatus">
    </div>



    {/*Annoucement */}
    <div className="announcement-box">
  <h3>📢 Admin Announcement</h3>

  <textarea
    placeholder="Write announcement here..."
    value={announcement}
    onChange={(e) => setAnnouncement(e.target.value)}
  />

  <button onClick={saveAnnouncement}>
    Publish
  </button>

  <div className="preview">
    <strong>Preview:</strong>
    <p>{announcement}</p>
    </div>
    </div>

     

      <div className="container mt-4 voters-section">
 {/*} <h2>Registered Voters</h2>*/}

  {/*<button onClick={getRegisteredVoters}>Load Registered Voters</button>*/}

  {/*<ul>
    {voters.map((v, index) => (
      <li key={index}>
        {v.name} — {v.votersAddress} <br />
        Status: {v.status.toString()} <br />
        Message: {v.message} <br />
        <hr />
      </li>
    ))}
  </ul>

<h2>Registered Candidates</h2>

 

  <ul>
    {candidates.map((c, index) => (
      <li key={index}>
        {c.name} — {c.candidatesAddress} <br />
        Status: {c.status.toString()} <br />
        Message: {c.message} <br />

        {c.status.toString() === "0" && (
          <button onClick={() => approveCandidate(c.candidatesAddress)}>
            Approve
          </button> 
        )}

        {c.status.toString() === "0" && (
          <button onClick={() => rejectCandidate(c.candidatesAddress)}>
            Reject
          </button> 
        )}

        <hr />
      </li>
    ))}
  </ul>*/}
  
 </div>
  <br/>
  <br/>
   <div className="admin-content">
     </div>

     {/* modal for election reset*/}
     <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "red"}}> ⚠️ Dangerous Action</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p><strong>This will DELETE all election data:</strong></p>
          <ul>
            <li>All Voters</li>
            <li>All Candidates</li>
            <li>All Votes</li>
            <li>All Election Results</li>
          </ul>

          <p>Type <strong>RESET</strong> to confirm:</p>

          <Form.Control 
          type="text"
          placeholder = "Type RESET to confirm"
          value={resetInput}
          onChange={(e) => setResetInput(e.target.value)}
          />
          </Modal.Body>

          <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetModal(false)}>
            Cancel
          </Button>

          <Button 
          variant="danger" 
          
          disabled={resetInput !== "RESET"}
          onClick={resetContract}
          >
            Confirm Reset
          </Button>
          </Modal.Footer>
          </Modal>
     
  
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

export default AdministratorPage;