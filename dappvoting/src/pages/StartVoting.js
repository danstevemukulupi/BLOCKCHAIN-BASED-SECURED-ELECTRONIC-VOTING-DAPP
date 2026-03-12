import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import './StartVoting.css';

import {ethers } from 'ethers';
import { useState, useEffect } from 'react';
import VotingArtifact from '../abi/VotingSystem.json';
//import { use } from 'chai';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function StartVoting() {

  const[status, setStatus] = useState("Loading.....");
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates ] = useState([]);
  const [account, setAccount] = useState("");

  // Connect Wallet 
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert ("Install MetaMask!");
      return; 
  } 

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    setAccount(accounts[0]);

  };
  


  // new connect 



    // new 
    // 1 Fetch registered candidates 
    const getRegisteredCandidates = async () => {
    if (!contract) return;
    try {
      const list = await contract.ListofRegisteredCandidates();
      setCandidates(list);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

   // 2 
    
    // end
 
    // commented 
    // Load approved candidates
   // const getApprovedCandidates = async (votingContract) => {
      //try {
       // const list = await votingContract.ListofApprovedCandidates(); 
       // setCandidateAddress(list);
      //}catch (error) {
        //console.error("Error loading candidates:", error);
      //}
    //};

    // commented 


    // Vote function 
    const voteForCandidate = async (candidateAddress) => {
      if (!window.ethereum) {
        alert("Connect wallet first.");
        return;
      }

      try {
         const provider = new ethers.providers.Web3Provider(window.ethereum); 
         const signer = provider.getSigner(); 

         const votingContract = new ethers.Contract(
          contractAddress,
          VotingArtifact.abi,
          signer
         );

         const tx = await votingContract.vote(candidateAddress); 

         await tx.wait();
          alert("Vote cast successfully!");

      } catch (error) {
        console.error("Voting error:", error); 
      }
    };



// load 
  useEffect(() => {

    const loadContract = async () => { 
    
    const provider = new ethers.providers.Web3Provider(window.ethereum); 

    const votingContract = new ethers.Contract( 
      contractAddress,
      VotingArtifact.abi,
      provider
    );

    setContract(votingContract);

    const list = await votingContract.ListofRegisteredCandidates();
    setCandidates(list);
    //await getApprovedCandidates(votingContract);
    const start = await votingContract.votingStartTime();
    const end = await votingContract.votingEndTime();

    const now = Math.floor(Date.now() / 1000);

    if(now < start ) {
      setStatus("Voting has not started yet. Please wait...");
    }

    else if (now >= start && now <= end ) {
      setStatus("Voting is currently active! Please cast your vote.");
    }

    else {
      setStatus("Voting has ended. Thank you for your participation!");
    }

    };

    loadContract();

    // check every 5 second 
    const interval = setInterval(loadContract, 5000);

    return () => clearInterval(interval);

  }, []);


    return(

      <>
        <Navbar expand = "lg" className='navbarColour'>
      <Container>
        <Navbar.Brand href="#home">Start Voting</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="my-center-nav">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/administrator-page">Dashboard</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <div className="container mt-4 candidates-section">
  
      {/* <button onClick={connectWallet}> 
        {account ? `Wallet: ${account}` : "Connect Wallet"} 
      </button> */}

      <h3>{status} </h3>

      {/* Show candidates only when voting is active */}
      {status === "Voting is currently active! Please cast your vote." && (

        <ul>  

          {candidates.map((c, index) => ( 
            <li key={index}> 
            <strong>{c.name}</strong> <br /> 

            Address: {c.candidatesAddress} <br /> 

            Votes: {c.voteCalculation.toString()} <br /> 

            <button 
            onClick={() => voteForCandidate(c.candidatesAddress)} 
            > 
            Vote
            </button>

            <hr /> 

            </li>    

          ))}

        </ul>
      )}
  
      </div>
    
    </>

    );
} 
export default StartVoting;










