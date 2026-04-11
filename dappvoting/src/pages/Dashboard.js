/*import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import VoterRegistration from './pages/VoterRegistration';
import CandidateRegistration from './pages/CandidateRegistration';
import Administrator from './pages/administrator';
import { AppProvider } from "./context/AppContext";

function App() {

  return (
  <AppProvider>
    <Router>
      

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/voter-registration" element={<VoterRegistration />} />

        <Route path="/candidate-registration" element={<CandidateRegistration />} />

        <Route path="/administrator" element={<Administrator />} />

      </Routes>

    </Router>

      </AppProvider>

  );

}

export default App;
*/

/* OLD */ 



//import './App.css';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import VotingArtifact from '../abi/VotingSystem.json';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VoterLogin from './VoterLogin';
import CandidateLogin from './CandidateLogin';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Dashboard.css';


const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
//const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";



function Dashboard() {
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
    //if (!contract || !voterName) return; // 1. it was her
    if (!contract || !voterName || !voterAge || !voterEmail || !voterPhone) return;// uncommented
    try {
      //const tx = await contract.registerVoter(voterName); // 2 it was here 
      const tx = await contract.registerVoter(voterName, parseInt(voterAge), voterEmail, voterPhone); // uncommented
      await tx.wait(); 
      alert("Registration submitted.waiting for admin approval")
      alert(`Voter ${voterName} registered!`); // 4 it was here
      //alert(`Voter ${voterAge} registered!`);
      //alert(`Voter ${voterEmail} registered!`);
      //alert(`Voter ${voterPhone} registered!`);
    
      setVoterName('');
      setVoterAge(''); // uncommented
      setVoterEmail(''); // uncommented
      setVoterPhone(''); // uncommented

      getRegisteredVoters();
    } catch (err) {
      console.error("Error registering voter:", err);
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
    <div className="App">
      <header className="App-header">

        <div className = "topnav">
          <Link to="/">Home</Link>
          <Link to="/administrator-page">Administrator</Link>
          <Link to="/help-infos">Help & Info</Link>

           {!walletConnected ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <p>Wallet connected: {account}</p>
        )}
        </div>



        

       
      {/* For the title and description of the dapp, and the buttons for how it works and current results */}
      <div className="App-title">
        <h1 style={{ color: "purple"}}>Empowering the Voice</h1>
        <h1 style={{ color: "lightskyblue"}}>of the Community</h1>
        <br/>
        <p style={{ color: "black" }}>MapoVote uses blockchain technology to guarantee secure, transparent, and tamper-proof voting.
          <br/>Built for national elections, it upholds the highest standards of integrity-ensuring every citizen's voice is heard, protected, and counted</p>

        <button style={{ background: "purple", color: "white" }}>How it Works</button> <button>Current Results</button>
        <br/>
        <br/>
        </div>
      
          {/* For admin, voters and candidates and registration and logging */}
          <div className="admin-section">
             
              <div className="admin">
                Administration

                <h6>System management and election control </h6>
                <ul className="admin-list">
                    <li> Voter Registry management</li>
                    <li> Candidate Registry management</li>
                    <li> Election control (start/end)</li>
                    <li> Result management</li>
                </ul>

                <button className="admin-btn">Admin Access</button>
                </div>


              <div className="voter">
                Voter Portal
                
                <h6>Cast your vote and view details of candidates.</h6>
                <ul className="voter-list">
                  <li>Secure ballot submission</li>
                  <li> Research candidate information</li>
                  <li> Track voting status</li>
                  <li> View election results</li>
                </ul>

                <button className="voter-btn">Voter Login</button>
                </div>

              <div className="candidate">
                Candidate Portal

                <h6>Manage your campaign and view election results.</h6>
                <ul className="candidate-list">
                  <li> Campaign management</li>
                  <li> Engage with voters</li>
                  <li> Visison and mission</li>
                  <li> View election results</li>
                </ul>
                <button className="candidate-btn">Candidate Login</button>
                </div>
          </div>

          <div className="Information-section">

          </div>



        <div className="form-container">
          <h2>Voter Registration</h2>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
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

          <button className="btn" onClick={registerVoter}>Register as Voter</button>
          <p className="login-text">
            Already registered? <Link to="/voter-login"  className="login-link">
            Login
            </Link>
          </p>

    
          <ul>
            {/*{ voters.map((v, index) => ( 
              <li key={index}>          
                {v.name} — {v.votersAddress} — Status: {v.status.toString()} — Message: {v.message}
              </li>
            ))}*/}
          </ul> 

          
        </div>

        <div className="form-container">
          <h2>Candidate Registration</h2>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={candidateAge}
            onChange={(e) => setCandidateAge(e.target.value)}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={candidateEmail}
            onChange={(e) => setCandidateEmail(e.target.value)}
          />
          
          <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={candidatePhone}
          onChange={(e) => setCandidatePhone(e.target.value)}
          />

          <button className="btn" onClick={registerCandidate}>Register as Candidate</button>
          <p className="login-text">
            Already registered? <Link to="/candidate-login" className="login-link">
            Login
            </Link>
          </p>
          {/*<h3>Registered Candidates</h3>*/}
         {/* <ul>
            {candidates.map((c, index) => (
              <li key={index}>
                {c.name} — {c.candidatesAddress} — Status: {c.status}
                <button onClick={() => voteForCandidate(c.candidatesAddress)}>Vote</button>
              </li>
            ))}
          </ul>*/}
        </div>
      </header>
    </div>
  );
}

export default Dashboard;