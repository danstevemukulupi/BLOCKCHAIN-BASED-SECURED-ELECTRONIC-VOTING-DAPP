import React, { useState } from "react";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './VoterLogin.css';


function VoterLogin() {

    const [voterEmail, setVoterEmail] = useState('');
    const [voterPassword, setVoterPassword] = useState('');




      const [candidateName, setCandidateName] = useState('');
      const [candidateAge, setCandidateAge] = useState('');
      const [candidateEmail, setCandidateEmail] = useState('');
      const [candidatePhone, setCandidatePhone] = useState('');
      const [candidates, setCandidates] = useState([]);
      const [contract, setContract] = useState(null);
    
      const [searchName, setSearchName] = useState('');
      const [searchAddress, setSearchAddress] = useState('');
      const [ searchResult, setSearchResult] = useState([]);
      const [ newName, setNewName] = useState(''); 


    const handleLogin = (e) => {
        e.preventDefault();

        // Login Logic
        console.log("Voter Email:", voterEmail, "Voter Password:", voterPassword);
        alert("Voter logged in successfully!");

    };

    // search candidate by name or address 
   const searchCandidate = async () => {
    if (!contract || !searchName || !searchAddress) return;

    try {
      const result = await contract.searchCandidate(searchName, searchAddress);
      setSearchResult(result);
    } catch (err) {
      console.error("Error searching candidate:", err);

    }
  };
  
  // update candidate information 
  const updateMyName = async () => {
    if (!contract || ! newName) return;

    try {
      const tx = await contract.updateCandidate(newName);
      await tx.wait();

      alert("Updated sucessfully!");
      setNewName('');
      getRegisteredCandidates();
    }
    catch (err) {
      console.error("Error updating candidate information:", err);
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
    "You are approved to run for office"

  );
    await tx.wait();

    alert("Candidate approved!");

    getRegisteredCandidates();
   
  } catch (err) {
    console.error("Error approving candidate:", err);
  }
};

// aceppted candidates
const getAcceptedCandidates = async () => {
  if (!contract) return;

  try {
    const list = await contract.ListofAcceptedCandidates();
    setCandidates(list);
  } catch (err) {
    console.error("Error fetching accepted candidates:", err);
  }
};













  return (
 
    

 

<div className="App">
    <div className="topnav">
       <a>
            <img src="./pics/MapoVote-nobackground.png" alt="logo" width={150} height={60} />
       </a>
        <h2 style={{ color: "purple" }}>MapoVote</h2>
        <Link to="/">Home</Link>
        <Link to="/voter-profile">Profile</Link>
        <NavDropdown title="Election" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/election-info">Election Info</NavDropdown.Item>  
              <NavDropdown.Item as={Link} to="/candidate-accepted-list">View Candidates</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/election-info">Election Info</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/vote-info">How To Vote</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/vote-status">Voting Status</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/vote-result"> Election Result </NavDropdown.Item> 
              <NavDropdown.Divider />
            </NavDropdown>
       <button>Connect Wallet</button>
    </div>
    <br/>
    <br/>

    <div className="voter-container">
      <h1 style={{ color: "purple"}}>Welcome, Voter!</h1>
      <h5>Your portal for participation in the upcoming general election.</h5>
    </div>

   <br/>
   <br/>

   < div style ={{marginBottom: "30px"}}>
       <h3>Search Candidate</h3>

       <input
        type="text"
        placeholder="Enter Name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        style={{ marginRight: "10px", padding: "5px"}}

       />

       <input
       type="text"
        placeholder="Enter wallet address"
        value={searchAddress}
        onChange={(e) => setSearchAddress(e.target.value)}
        style={{ marginRight: "10px", padding: "5px", width: "300px" }}

       />
       <button
        onClick={searchCandidate}
       style={{
        padding: "6px 12px",
        background: "purple",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
       }}
       >
        Search

       </button>

       </div>

       
       <div style={{ display: "flex", gap: "20px", flexWrap: "wrap"}}>
        {
          searchResult.map((c, index) => (
            <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "20px",
              width: "300px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
            }}
            >
              <h4>{c.name}</h4>
              <p><b>Address:</b> {c.candidatesAddress}</p>
              <p><b>Status:</b> {c.status.toString()}</p>
              <p><b>Message:</b> {c.message}</p>

              {/* update section */}
              <input 
              type="text"
              placeholder="New name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ marginRight: "10px", padding: "5px", width: "100%" }}  
              />

              <button 
              onClick={() => updateMyName(c.candidatesAddress)} 
              style={{
                marginTop: "10px",
                background: "blue",
                color: "white", 
                padding: "6px",
                border: "none",
                borderRadius: "6px",
                width: "100%",
                cursor: "pointer"
              }}
              >
                Update Name
              </button>
            </div>
          ))}

       </div>







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

   /*<div >
      <h2>Voter Login</h2>
    
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter Email"
          value={voterEmail}
          onChange={(e) => setVoterEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={voterPassword}
          onChange={(e) => setVoterPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <br />

      <Link to ="/"> Back to Home</Link>
    </div>*/


  );
}

export default VoterLogin;