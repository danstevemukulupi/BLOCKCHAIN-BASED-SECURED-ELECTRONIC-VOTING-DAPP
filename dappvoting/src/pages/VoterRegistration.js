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

  // new 
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [ searchResult, setSearchResult] = useState([]);
  const [ newName, setNewName] = useState(''); 
  // end new
  
  // find and update voter information
  const searchVoter = async () => {
    if (!contract || !searchName || !searchAddress) return;

    try {
      const result = await contract.searchVoter(searchName, searchAddress);
      setSearchResult(result);
    } catch (err) {
      console.error("Error searching voter:", err);

    }
  };
  // end find and update voter information

  // update voter information
  const updateMyName = async () => {
    if (!contract || ! newName) return;

    try {
      const tx = await contract.updateVoter(newName);
      await tx.wait();

      alert("Updated sucessfully!");
      setNewName('');
      getRegisteredVoters();
    }
    catch (err) {
      console.error("Error updating voter information:", err);
    }
  };
  // end update voter information

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

// approve voter
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

// reject voter 
const rejectVoter = async (voterAddress) => {
  if (!contract) return;
  try {
    const tx = await contract.rejectVoter(
      voterAddress,
    "You have been rejected as a voter! Update your information and try again."

  );
    await tx.wait();

    alert("Voter rejected!");

    getRegisteredVoters();
   
  } catch (err) {
    console.error("Error rejecting voter:", err);
  }
};



// 

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

     <div className="App">
      <div className="topnav">
        <a>
       
            <img src="./pics/MapoVote-nobackground.png" alt="logo" width={150} height={60} />

          </a>
          <h2 style={{ color: "purple" }}>MapoVote</h2>
          <Link to="/">Home</Link>
          <Link to="/administrator-page">Administrator</Link>
          <Link to="/help-infos">Help & Info</Link>
      </div>
         
      <br/>
      <br/>
          
          <div  className="App-title">
            <h1 style={{ color: "purple"}}>Voter Management</h1>
            <h5>Review and manage registered voters in the system</h5>

          </div>
       <br/>
       <br/>

     


       < div style ={{marginBottom: "30px"}}>
       <h3>Search Voter</h3>

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
        onClick={searchVoter}
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
          searchResult.map((v, index) => (
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
              <h4>{v.name}</h4>
              <p><b>Address:</b> {v.votersAddress}</p>
              <p><b>Status:</b> {v.status.toString()}</p>
              <p><b>Message:</b> {v.message}</p>

              {/* update section */}
              <input 
              type="text"
              placeholder="New name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ marginRight: "10px", padding: "5px", width: "100%" }}  
              />

              <button 
              onClick={() => updateMyName(v.votersAddress)} 
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
      


       

      <div className="admin-container">
        <h3 >Voter Registry</h3>
    
        <table className="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Address</th>
        <th>Status</th>
        <th>Message</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {voters.map((v, index) => (
        <tr key={index}>
          <td>{v.name}</td>
            <td>{v.votersAddress}</td>
            <td>{v.status.toString()}</td>
            <td>{v.message}</td>
            <td>
            {v.status.toString() === "0" && (

              <div style={{ color: "green", display: "inline-block", marginRight: "10px" }}>
              <button onClick={() => approveVoter(v.votersAddress)}
                style= {{ 
                  background: "green", 
                  color: "white", 
                  border: "none", 
                  borderCollapse: "collapse", 
                  borderRadius: "8px", 
                  padding: "5px 10px", 
                  marginLeft: "10px",
                  cursor: "pointer"
                }}>
                Approve 
              </button>
              </div>   
            )}

            
            {v.status.toString() === "0" && (
             
              <button onClick={() => rejectVoter(v.votersAddress)}
              
              style= {{ 
                background: "red", 
                color: "white", 
                border: "none", 
                borderCollapse: "collapse", 
                borderRadius: "8px", 
                padding: "5px 10px", 
                marginLeft: "10px",
                cursor: "pointer"
              }}>
              Reject
              </button> 
            )}

          </td>
        </tr>
      ))}
    </tbody>
  </table>




          
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

    ) 
  } 

export default VoterRegistration;