
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
  //const [contract, setContract] = useState(null);
  //const [candidates, setCandidates ] = useState([]);
  const [account, setAccount] = useState("");


  // 1
  // trying to load candidates
const [candidateName, setCandidateName] = useState('');
      const [candidateAge, setCandidateAge] = useState('');
      const [candidateEmail, setCandidateEmail] = useState('');
      const [candidatePhone, setCandidatePhone] = useState('');
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
    if (!contract || !candidateName || !candidateAge || !candidateEmail || !candidatePhone) return;
    //if (!contract || !candidateName ) return;
    try {
      //const tx = await contract.registerCandidate(candidateName);
      const tx = await contract.registerCandidate(candidateName, parseInt(candidateAge), candidateEmail, candidatePhone);
      await tx.wait();
      alert(`Candidate ${candidateName} registered!`);
    

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
    "You are approved to run for office"

  );
    await tx.wait();

    alert("Candidate approved!");

    getRegisteredCandidates();
   
  } catch (err) {
    console.error("Error approving candidate:", err);
  }
};

  // end of loading candidates


  

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
    //const getRegisteredCandidates = async () => {
    //if (!contract) return;
    //try {
      //const list = await contract.ListofRegisteredCandidates();
      //setCandidates(list);
    //} catch (err) {
      //console.error("Error fetching candidates:", err);
    //}
  //};

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
      setStatus("You have voted. Thank you for your participation!");
    }

    };

    loadContract();

    // check every 5 second 
    const interval = setInterval(loadContract, 5000);

    return () => clearInterval(interval);

  }, []);


    return(



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
      <h1 style={{ color: "purple"}}>Secure Voting Session </h1>
      <h5 className="enc-An-i">Encrypted.Anonymous.Irreversible</h5>
    </div>
    <br/>
    


   


  
      {/* <button onClick={connectWallet}> 
        {account ? `Wallet: ${account}` : "Connect Wallet"} 
      </button> */}

      {/*<h3>{status} </h3>*/}

      {/* Show candidates only when voting is active */}
      {/*{status === "Voting is currently active! Please cast your vote." && (

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
      )}*/}

      
      <br/>
      <br/>

      <div> 
      </div>


      <h3 className="status-center">{status}</h3>

    {status === "Voting is currently active! Please cast your vote." && (
  <div className="voting-section">
    {candidates.map((c, index) => (
      <div className="voting-section-child" key={index}>
        <strong>{c.name}</strong><br />
        Address: {c.candidatesAddress}<br />
        Votes: {c.voteCalculation.toString()}<br />

        <button
          onClick={() => voteForCandidate(c.candidatesAddress)}
          className="vote-button"
        >
          Vote
        </button>
      </div>
    ))}
  </div>
   )}


       


        
        <br/>
        <br/>    
        <br/>
        <br/>
        <div className="voter-content">
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
    


    );
} 
export default StartVoting;










