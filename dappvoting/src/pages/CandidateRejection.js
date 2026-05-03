import {ethers } from 'ethers';
import VotingArtifact from '../abi/VotingSystem.json';
import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import './CandidateRejection.css';

//const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractAddress = "0x110Ba63afa08375042910EC633fb2DA7A16F51B0" // new

function CandidateRejection() {

     const [candidateName, setCandidateName] = useState('');
     const [candidateAge, setCandidateAge] = useState('');
     const [candidateGender, setCandidateGender] = useState('');
     const [candidateCountry, setCandidateCountry] = useState('');
     const [candidates, setCandidates] = useState([]);
     const [contract, setContract] = useState(null);

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

  // Register Candidate
  const registerCandidate = async () => {
    //if (!contract || !candidateName) return;
    if (!contract || !candidateName || !candidateAge || !candidateGender || !candidateCountry) return;
    try {
      //const tx = await contract.registerCandidate(candidateName);
      const tx = await contract.registerCandidate(candidateName, parseInt(candidateAge), candidateGender, candidateCountry);
      await tx.wait();
      alert(`Candidate ${candidateName} registered!`);
    
    
      setCandidateName('');
      setCandidateAge('');
      setCandidateGender('');
      setCandidateCountry('');
      getRegisteredCandidates();
    } catch (err) {
      console.error("Error registering candidate:", err);
    }
  };

  // reject  candidate
const rejectCandidate = async (candidateAddress) => {
  if (!contract) return;
  try {
    const tx = await contract.rejectCandidate(
      candidateAddress,
    "Your registration has been rejected"
  );
    await tx.wait();

    alert("Candidate rejected!");

    getRegisteredCandidates();
   
  } catch (err) {
    console.error("Error rejecting candidate:", err);
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

          // automatically load candidates
          const list = await votigContract.ListofRegisteredCandidates();
          setCandidates(list);
      } catch (err) {
        console.error("Error loading contract:", err);
      }
    };
    loadContract();
  }, [])

  useEffect(() => {
    if(contract) {
      getRegisteredCandidates();
    }
  }, [contract])



    return(

      <>

        <Navbar expand = "lg" className='navbarColour'>
      <Container>
        <Navbar.Brand href="#home"> Candidates Rejection </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="my-center-nav">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/administrator-page">Dashboard</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <div className="container mt-4 candidate-section">
            <h1>Rejected Candidates</h1>
  <ul>
    {candidates.map((c, index) => (
      <li key={index}>
        {c.name} — {c.candidatesAddress} <br />
        Status: {c.status.toString()} <br />
        Message: {c.message} <br />

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

    )
}
export default CandidateRejection;