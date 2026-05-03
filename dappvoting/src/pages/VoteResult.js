
import {ethers } from 'ethers';
import VotingArtifact from '../abi/VotingSystem.json';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './VoteResult.css';
//import { use } from 'chai';
import axios from 'axios';

//const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// SEPOLIA ADDRESS INSIDE .ENV
//const contractAddress = "0x65F5f54d2E24F9C9B9919D4e3cDe3fBe533D7bD5"
const contractAddress = "0x110Ba63afa08375042910EC633fb2DA7A16F51B0"

function VoteResult() {
  const [candidateName, setCandidateName] = useState('');
      const [candidateAge, setCandidateAge] = useState('');
      const [candidateGender, setCandidateGender] = useState('');
      const [candidateCountry, setCandidateCountry] = useState('');

      const [candidateCounty, setCandidateCounty] = useState('');
      const [politicalParty, setPoliticalParty] = useState('');
      const [goalsManifesto, setGoalsManifesto] = useState('');
      const [vision, setVision] = useState('');
      const [experience, setExperience] = useState('');
      const [candidatenationalId, setCandidateNationalId] = useState('');
      const [candidates, setCandidates] = useState([]);





      const [voterName, setVoterName] = useState('');
      const [voterAge, setVoterAge] = useState('');
      const [voterGender, setVoterGender] = useState('');
      const [voterCountry, setVoterCountry] = useState('');
      const [voterCounty, setVoterCounty] = useState('');
      const [voternationalId, setVoterNationalId] = useState('');
      const [voters, setVoters] = useState([]);

      const [contract, setContract] = useState(null);

      const [winner, setWinner] = useState(null); 

      

    const loadCandidateWinner = async () => {
    //try {
      ///const contract = await getContract();
      //setContract(contract);

      //const data = await contract.winningCandidate();

      if (!contract) return;

      try {
        const result = await contract.winningCandidate();
        setCandidates([result]);

      //}

      // Fetch winner details from backend using IPFS hash
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/candidate/${result.ipfsHash}`);
      setWinner({
        result,
        candidateName: res.data.name,
        candidatePoliticalParty: res.data.politicalParty,
        voteCalculation: result.voteCalculation.toString(),
      });
       
    



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
              const res = await axios.get(`${process.env.REACT_APP_API_URL}/candidate/${c.ipfsHash}`);
  
              return {
                ...c,
                candidateName: res.data.name,
                candidateAge: res.data.age,
                candidateGender: res.data.gender,
                candidateCountry: res.data.country,
                candidateCounty: res.data.county,
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
                  candidateGender: "N/A",
                  candidateCountry: "N/A",
                  candidateCounty: "N/A",
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
    if (!contract || !candidateName || !candidateAge || !candidateGender || !candidateCountry || !candidateCounty || !politicalParty || !goalsManifesto || !vision || !experience || !candidatenationalId) return;

    try {
          // 1. Upload candidate details to backend (which will store on IPFS)
          const ipfsCandidateData = {
            name: candidateName,
            age: candidateAge,
            gender: candidateGender,
            country: candidateCountry,
            county: candidateCounty,
            politicalParty: politicalParty,
            goalsManifesto: goalsManifesto,
            vision: vision,
            experience: experience,
            nationalId: candidatenationalId
          };

          // Upload to IPFS and get the hash
        const response = await axios.post(
  `${process.env.REACT_APP_API_URL}/upload`,
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
      setCandidateGender('');
      setCandidateCountry('');
      setCandidateCounty('');
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

  // new 
  // Fetch registered voters
  const getRegisteredVoters = async () => {
    if (!contract) return;
    try {
      const list = await contract.ListofAcceptedVoters();
      
      const votersWithDetails = await Promise.all(
        list.map(async (v) => {

          console.log("FULL VOTER OBJECT:", v); 
          console.log("HASH FROM CONTRACT:", v.ipfsHash); 
          try {
            // fetch details from backend using IPFS hash 
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/voter/${v.ipfsHash}`);

            return {
              ...v,
              voterName: res.data.name,
              voterAge: res.data.age,
              voterGender: res.data.gender,
              voterCountry: res.data.country,
              voterCounty: res.data.county,
              voterNationalId: res.data.nationalId,
            };
            } catch (err) {
              console.error("Error fetching voter details from backend:", err);

              // fallback if IPFs fails
              return {
                ...v,
                voterName: "N/A",
                voterAge: "N/A",
                voterGender: "N/A",
                voterCountry: "N/A",
                voterCounty: "N/A",
                voterNationalId: "N/A",
              };
            }
          
        })
      );

      setVoters(votersWithDetails);
    } catch (err) {
      console.error("Error fetching voters:", err);
    }
  };

  // Register Voter
  const registerVoter = async () => {
    //if (!contract || !voterName) return;
    if (!contract || !voterName || !voterAge || !voterGender || !voterCountry || !voterCounty || !voternationalId ) return;
    try {

       // Upload voter data to IPFS and get the hash
        const ipfsVoterData = {
        name: voterName,
        age: voterAge,
        gender: voterGender,
        country: voterCountry,
        county: voterCounty,
        nationalId: voternationalId,
      
      };

       // Upload to IPFS and get the hash
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`,ipfsVoterData
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


     
      // Register voter and store only the IPFS hash on blockchain
      const tx = await contract.registerVoter(ipfsHash);
      await tx.wait();
      alert(`Voter ${voterName} registered!`);
    
    
      setVoterName('');
      setVoterAge('');
      setVoterGender('');
      setVoterCountry('');
      setVoterCounty('');
      setVoterNationalId('');

      getRegisteredVoters();
    } catch (err) {
      console.error("Error registering voter:", err);
    }
  };

  // Auto fetch voters & candidates when contract changes
  useEffect(() => {
    if (contract) {
      getRegisteredVoters();
      getRegisteredCandidates();
    }
  }, [contract]);

  // end 
  

  

  

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
    

      {winner === null ? ( 
        <h1 className="winner-loading">Winner Candidate Loading....</h1>

      ): winner.candidatesAddress === ethers.constants.AddressZero? (
        <p className="election-not-finished">⏳ Election not finished yet</p>
      ) : ( 

     
        <div>
           <h1 className="congratulations"> CONGRATULATIONS </h1>
           <h1 className="cup">🏆</h1>
           <br/>
           <br/>

            <div>
          <p className="winner">Winner </p> 
          <br/>
          <br/> 
          <p className="winner-name"><strong>{winner.candidateName}</strong></p>
          <p className="winner-political"><strong>{winner.candidatePoliticalParty}</strong></p>
          <p className="winner-votes"><strong>Votes:</strong> {winner.voteCalculation.toString()}</p>
          </div>
          <br/>
          <br />

          <p className="total-candidate"><strong>Total Candidates: {candidates.length}</strong></p>
          <p className="total-voter"><strong>Total Voters: {voters.length}</strong></p>
        

          

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