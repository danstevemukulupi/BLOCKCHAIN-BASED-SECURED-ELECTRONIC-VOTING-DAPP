/*import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function VoterRegistration() {
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

  const registerVoter = async () => {
    if (!wallet) {
      setStatus("❌ Connect wallet first");
      return;
    }
    if (!form.name || !form.age || !form.email || !form.phone) {
      setStatus("❌ Fill all fields");
      return;
    }
    if (!contract) {
      setStatus("❌ Contract not loaded");
      return;
    }

    try {
      setStatus("⏳ Waiting for MetaMask confirmation...");
      const tx = await contract.registerVoter(
        form.name,
        parseInt(form.age),
        form.email,
        form.phone
      );
      await tx.wait();
      setStatus("✅ Registered successfully!");
      setForm({ name: "", age: "", email: "", phone: "" });
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
      <h2>Voter Registration</h2>

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

      <button className="btn" onClick={registerVoter}>Register Voter</button>

      {status && <p className="status-message">{status}</p>}
    </div>
  );
}

export default VoterRegistration;
*/

import {ethers } from 'ethers';
import VotingArtifact from '../abi/VotingSystem.json';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './VoterRegistration.css';
import { use } from 'chai';



const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function VoterRegistration() {


  const [voterName, setVoterName] = useState('');
  const [voterAge, setVoterAge] = useState('');
  const [voterEmail, setVoterEmail] = useState('');
  const [voterPhone, setVoterPhone] = useState('');
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
    if (!contract || !voterName || !voterAge || !voterEmail || !voterPhone) return;
    try {
      //const tx = await contract.registerVoter(voterName);
      const tx = await contract.registerVoter(voterName, parseInt(voterAge), voterEmail, voterPhone);
      await tx.wait();
      alert(`Voter ${voterName} registered!`);
    
    
      setVoterName('');
      setVoterAge('');
      setVoterEmail('');
      setVoterPhone('');
      getRegisteredVoters();
    } catch (err) {
      console.error("Error registering voter:", err);
    }
  };


const approveVoter = async (voterAddress) => {
  if (!contract) return;
  try {
    const tx = await contract.approveVoter(
      voterAddress,
    "You are approved to vote"
  );
    await tx.wait();

    alert("Voter approved!");

    getRegisteredVoters();
   
  } catch (err) {
    console.error("Error approving voter:", err);
  }
};

const rejectVoter = async (voterAddress) => {
  if (!contract) return;
  try {
    const tx = await contract.rejectVoter(
      voterAddress,
    "You are not approved to vote"

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
        const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545"); // hardhat local node 

        const votigContract = new ethers.Contract(
          contractAddress,
          VotingArtifact.abi,
          provider);

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




        <div className="container mt-4 voters-section">
            <h1>Voter Registration Page</h1>


<button onClick={getRegisteredVoters}>Load Registered Voters</button>

  <ul>
    {voters.map((v, index) => (
      <li key={index}>
        {v.name} — {v.votersAddress} <br />
        Status: {v.status.toString()} <br />
        Message: {v.message} <br />

        {v.status.toString() === "0" && (
          <button onClick={() => approveVoter(v.votersAddress)}>
            Approve
          </button> 
        )}

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

export default VoterRegistration;