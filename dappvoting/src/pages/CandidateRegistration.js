/*import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function CandidateRegistration() {
  const { wallet, contract, connectWallet } = useContext(AppContext);

  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
   
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerCandidate = async () => {
    if (!wallet) {
      setStatus("❌ Connect wallet first");
      return;
    }
    if (!form.name || !form.age || !form.email || !form.phone) {
      setStatus("❌ Fill all required fields");
      return;
    }
    if (!contract) {
      setStatus("❌ Contract not loaded");
      return;
    }

    try {
      setStatus("⏳ Waiting for MetaMask confirmation...");

      const tx = await contract.registerCandidate(
        form.name,
        parseInt(form.age),
        form.email,
        form.phone,
      
      );

      await tx.wait();

      setStatus("✅ Candidate registered successfully!");
      setForm({
        name: "",
        age: "",
        email: "",
        phone: "",
       
      });
    } catch (err) {
      console.error(err);
      if (err.code === 4001) {
        setStatus("❌ Transaction rejected");
      } else {
        setStatus("❌ Transaction failed");
      }
    }
  };

  return (
    <div className="form-container">
      <Link to="/" className="back-link">⬅ Back to Home</Link>
      <h2>Candidate Registration</h2>

      {!wallet ? (
        <button className="btn" onClick={connectWallet}>
          Connect MetaMask
        </button>
      ) : (
        <p><b>Wallet:</b> {wallet}</p>
      )}

      <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
      <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      

      <button className="btn" onClick={registerCandidate}>Register Candidate</button>

      {status && <p className="status-message">{status}</p>}
    </div>
  );
}

export default CandidateRegistration;
*/
import {ethers } from 'ethers';
import VotingArtifact from '../abi/VotingSystem.json';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './CandidateRegistration.css';
import { use } from 'chai';


const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";



function CandidateRegistration() {

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
    const loadContract = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545"); // hardhat local node 

        const votigContract = new ethers.Contract(
          contractAddress,
          VotingArtifact.abi,
          provider);

          setContract(votigContract);

          // automatically load voters
          const list = await votigContract.getRegisteredCandidates();
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
        <Navbar.Brand href="#home">Administrator Panel</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="my-center-nav">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            

        
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>


      <div className="container mt-4 candidates-section">
  
      <h2>Registered Candidates</h2>

 

  <ul>
    {candidates.map((c, index) => (
      <li key={index}>
        {c.name} — {c.candidateAddress} <br />
        Status: {c.status.toString()} <br />
        Message: {c.message} <br />

        

        <hr />
      </li>
    ))}
  </ul>
  
      </div>
       

       </>
    ) 
  }
export default CandidateRegistration;    