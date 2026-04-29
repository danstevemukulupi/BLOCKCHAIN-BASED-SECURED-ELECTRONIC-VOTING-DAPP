
import {ethers } from 'ethers';
import VotingArtifact from '../abi/VotingSystem.json';
import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import './VoterRejection.css';


const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function VoterRejection() {

    const [voterName, setVoterName] = useState('');
    const [voterAge, setVoterAge] = useState('');
    const [voterGender, setVoterGender] = useState('');
    const [voterCountry, setVoterCountry] = useState('');
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
    if (!contract || !voterName || !voterAge || !voterGender || !voterCountry ) return;
    try {
      //const tx = await contract.registerVoter(voterName);
      const tx = await contract.registerVoter(voterName, parseInt(voterAge), voterGender, voterCountry);
      await tx.wait();
      alert(`Voter ${voterName} registered!`);
    
    
      setVoterName('');
      setVoterAge('');
      setVoterGender('');
      setVoterCountry('');
      getRegisteredVoters();
    } catch (err) {
      console.error("Error registering voter:", err);
    }
  };

  // reject  voter
const rejectVoter = async (voterAddress) => {
  if (!contract) return;
  try {
    const tx = await contract.rejectVoter(
      voterAddress,
    "Your registration has been rejected"
  );
    await tx.wait();

    alert("Voter rejected!");

    getRegisteredVoters();
   
  } catch (err) {
    console.error("Error rejecting voter:", err);
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

      <>
      
        <Navbar expand = "lg" className='navbarColour'>
      <Container>
        <Navbar.Brand href="#home"> Administrator Panel</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="my-center-nav">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/administrator-page">Dashboard</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <div className="container mt-4 voters-section">
            <h1>Rejected Voters</h1>
  <ul>
    {voters.map((v, index) => (
      <li key={index}>
        {v.name} — {v.votersAddress} <br />
        Status: {v.status.toString()} <br />
        Message: {v.message} <br />

        {v.status.toString() === "0" && (
          <button onClick={() => rejectVoter(v.votersAddress)}>
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
export default VoterRejection;