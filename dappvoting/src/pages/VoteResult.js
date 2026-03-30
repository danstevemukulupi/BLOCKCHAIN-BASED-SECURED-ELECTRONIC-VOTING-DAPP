
import {ethers } from 'ethers';
import VotingArtifact from '../abi/VotingSystem.json';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './VoteResult.css';
import { use } from 'chai';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function VoteResult() {
  const [candidateName, setCandidateName] = useState('');
      const [candidateAge, setCandidateAge] = useState('');
      const [candidateEmail, setCandidateEmail] = useState('');
      const [candidatePhone, setCandidatePhone] = useState('');
      const [Candidates, setCandidates] = useState(null);

      const [contract, setContract] = useState(null);

  const loadCandidateWinner = async () => {
    //try {
      ///const contract = await getContract();
      //setContract(contract);

      //const data = await contract.winningCandidate();

      if (!contract) return;

      try {
        const result = await contract.winningCandidate();
        setCandidates(result);

      //}

      //setWinner(data);
    } catch (error) {
      console.error('Error loading winner:', error);
      //console.log("Still waiting for election to end....");

      //setWinner("NOT_READY");
    }
  }; 

 // trying 
 // Auto fetch voters & candidates when contract changes
  useEffect(() => {
    const loadContract = async () => {
      try {
        //const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545"); // hardhat local node 

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const votigContract = new ethers.Contract(
          contractAddress,
          VotingArtifact.abi,
          signer);

          setContract(votigContract);

          // automatically load winner
          const result = await votigContract.winningCandidate();
          setCandidates(result);
      } catch (err) {
        console.error("Error loading contract:", err);
      }
    };
    loadContract();
  }, [])


 // end of trying




// auto refresh winner
  useEffect(() => {
    if (!contract) return;

    loadCandidateWinner();

    const interval = setInterval(loadCandidateWinner, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount

  }, [contract]);

  // checktimes
  useEffect(() => { 
    const checkTimes = async () => { 
      if (!contract) return; 

      try {
        const end = await contract.votingEndTime();


        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const block = await provider.getBlock("latest");

        console.log("Voting end time:", end.toString());
        console.log("Blockchain time:", block.timestamp);


         
        // first candidates wins if there is none
        //const candidates = await contract.ListofRegisteredCandidates();
        //console.log("Registered candidates:", candidates);

        if (block.timestamp > end.toNumber()) { 
          console.log("✅ Voting has ended");
      } else {
        console.log("⏳ Voting is still ongoing");
      }
    } catch (err) {
      console.error("Error checking times:", err);
    }
    };

    checkTimes();
  }, [contract]);
  // end of checktimes

    return(

      <>
        <Navbar expand = "lg" className='navbarColour'>
      <Container>
        <Navbar.Brand href="#home"> Result </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="my-center-nav">
            <Nav.Link href="/">Home</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <Container className="mt-4">
      <h2>🏆 Winning Candidate</h2>

      {Candidates === null ? ( 
        <p>Loading....</p>

      ): Candidates.candidatesAddress === ethers.constants.AddressZero? (
        <p>⏳ Election not finished yet</p>
      ) : ( 

        <div>
          <p><strong>Name:</strong> {Candidates.name}</p>
          <p><strong>Votes:</strong> {Candidates.voteCalculation.toString()}</p>
        </div>
      )}
    </Container>
    </>

    )
}
export default VoteResult;