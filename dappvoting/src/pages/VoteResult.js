
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
import axios from 'axios';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function VoteResult() {
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
      const [Candidates, setCandidates] = useState(null);
      const [Voters, setVoters] = useState([]);

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

  // new
  // Fetch registered candidates with details from backend
  const getRegisteredCandidates = async () => {
      if (!contract) return;
      try {
        const list = await contract.ListofAcceptedCandidates();
        
        const candidatesWithDetails = await Promise.all(
          list.map(async (c) => {
  
            console.log("FULL CANDIDATE OBJECT:", c); 
            console.log("HASH FROM CONTRACT:", c.ipfsHash); 
            try {
              // fetch details from backend using IPFS hash 
              const res = await axios.get(`http://localhost:5000/candidate/${c.ipfsHash}`);
  
              return {
                ...c,
                candidateName: res.data.name,
                candidateAge: res.data.age,
                candidateEmail: res.data.email,
                candidatePhone: res.data.phone,
                candidateHomeAddress: res.data.address,
                politicalParty: res.data.politicalParty,
                goalsManifesto: res.data.goalsManifesto,
                vision: res.data.vision,
                experience: res.data.experience,
                candidateNationalId: res.data.nationalId,
              };
              } catch (err) {
                console.error("Error fetching candidate details from backend:", err);
  
                // fallback if IPFs fails
                return {
                  ...c,
                  candidateName: "N/A",
                  candidateAge: "N/A",
                  candidateEmail: "N/A",
                  candidatePhone: "N/A",
                  candidateHomeAddress: "N/A",
                  politicalParty: "N/A",
                  goalsManifesto: "N/A",
                  vision: "N/A",
                  experience: "N/A",
                  candidateNationalId: "N/A",
                };
              }
            
          })
        );
  
        setCandidates(candidatesWithDetails);
      } catch (err) {
        console.error("Error fetching candidates:", err);
      }
    };
  
  // end 

  // register candidate with IPFS
  const registerCandidate = async () => {
    if (!contract || !candidateName || !candidateAge || !candidateEmail || !candidatePhone || !candidatehomeAddress || !politicalParty || !goalsManifesto || !vision || !experience || !candidatenationalId) return;

    try {
          // 1. Upload candidate details to backend (which will store on IPFS)
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
            nationalId: candidatenationalId
          };

          // Upload to IPFS and get the hash
        const response = await axios.post(
  "http://localhost:5000/upload",
  ipfsCandidateData
);

console.log("UPLOAD RESPONSE:", response.data);

// HARD CHECK
if (!response.data || !response.data.IpfsHash) {
  throw new Error("IPFS upload failed or missing IpfsHash");
}

const ipfsHash = response.data.IpfsHash;


console.log("FULL IPFS HASH BEFORE CONTRACT:", ipfsHash);
console.log("FINAL IPFS HASH:", ipfsHash);

if (typeof ipfsHash !== "string") {
  throw new Error("Invalid IPFS hash type");
}


     
      // Register candidate and store only the IPFS hash on blockchain
      const tx = await contract.registerCandidate(ipfsHash);
      await tx.wait();
      alert(`Candidate ${candidateName} registered!`);
    
    
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

  // end Fetch registered candidates 
  // end new

  // new 2
  

  // end new 2


  






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
      
      <br/>
      <br/>
      <br/>
      
      
      <div className="voter-container">
      <h1 style={{ color: "purple"}}>Official Election Results</h1>
      <h5>The final results and outcomes are presented as determined by all votes cast after voting has concluded.</h5>
    </div>

      <br/>
      <br/>
    
    
    
    <Container className="mt-4">
    

      {Candidates === null ? ( 
        <h1 className="winner-loading">Winner Candidate Loading....</h1>

      ): Candidates.candidatesAddress === ethers.constants.AddressZero? (
        <p className="election-not-finished">⏳ Election not finished yet</p>
      ) : ( 

     
        <div>
           <h1 className="congratulations"> CONGRATULATIONS </h1>
           <h1 className="cup">🏆</h1>
           <br/>
           <br/>
          <p className="total-candidate"><strong>Total Candidates: {Candidates.length}</strong></p>
          <p className="total-voter"><strong>Total Voters: {Voters.length}</strong></p>
          <p className="winner">Winner </p>
          <p className="winner-name"><strong>{Candidates.candidateName}</strong></p>
      
          <p className="winner-political"><strong>{Candidates.candidatePoliticalParty}</strong></p>
          <p className="winner-votes"><strong>Votes:</strong> {Candidates.voteCalculation.toString()}</p>

        </div>
      )}
    </Container>


     
       <div className="App">
    <div className="topnav">
       <a>
            <img src="./pics/MapoVote-nobackground.png" alt="logo" width={150} height={60} />
       </a>
        <h2 style={{ color: "purple" }}>MapoVote</h2>
        <Link to="/">Home</Link>
        <Link to="/voter-profile">Profile</Link>
     
       
    </div>
    <br/>
    <br/>

    <div className="voter-container">
      
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






    </>

    )
}
export default VoteResult;