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

import './AdministratorPage.css';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import VotingArtifact from '../abi/VotingSystem.json';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';



const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
//const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";



function AdministratorPage() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);

  const [voterName, setVoterName] = useState('');
  const [voterAge, setVoterAge] = useState('');
  const [voterEmail, setVoterEmail] = useState('');
  const [voterPhone, setVoterPhone] = useState('');

  const [candidateName, setCandidateName] = useState('');
  const [candidateAge, setCandidateAge] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [voters, setVoters] = useState([]);
  const [candidates, setCandidates] = useState([]);

  // Connect Wallet
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
  const registerVoter = async () => {
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
  };


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

const rejectVoter = async (voterAddress) => {
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
  const registerCandidate = async () => {
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


  return (
    <>
    <Navbar expand = "lg" className='navbarColour'>
      <Container>
        <Navbar.Brand href="#home">Administrator Panel</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="my-center-nav">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Voters " id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/voter-Registration">List of Registered Voters</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/voter-approval">Voter Approval</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/voter-rejection">Voter Rejection</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/voter-accepted-list">List of Accepted Voters</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/voter-rejected-list">List of Rejected Voters</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/voter-finderr">Find Voter</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Candidates " id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/candidate-Registration">List of Registered Candidates</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/candidate-approval">Candidate Approval</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/candidate-rejection">Candidate Rejection</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/candidate-accepted-list">List of Accepted Candidates</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/candidate-rejected-list">List of Rejected Candidates</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/candidate-finder">Find Candidate</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/start-election">Start Election</Nav.Link>
            <Nav.Link as ={Link} to="/vote-result-publishment"> Result Publication</Nav.Link>


           {!walletConnected ? (
           <button onClick={connectWallet}>Connect Wallet</button>
           ) : (
           <p>Wallet connected: {account}</p>
            )}
      


          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    
      <div className="container mt-4 voters-section">
  <h2>List Registered Voters</h2>

  {/*<button onClick={getRegisteredVoters}>Load Registered Voters</button>*/}

  <ul>
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
  </ul>
  





</div>
      </>
  
  );
}   

export default AdministratorPage;