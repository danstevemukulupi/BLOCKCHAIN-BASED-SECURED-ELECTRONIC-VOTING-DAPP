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

import axios from 'axios';


const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";



function CandidateRegistration() {

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
  

  const [candidates, setCandidates] = useState([]);
  const [contract, setContract] = useState(null);

  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [ searchResult, setSearchResult] = useState([]);
  const [ newName, setNewName] = useState(''); 
  

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


  {/*// Fetch registered candidates
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
  };*/}

  // Fetch registered candidates with details
  // Fetch registered voters
    const getRegisteredCandidates = async () => {
      if (!contract) return;
      try {
        const list = await contract.ListofRegisteredCandidates();
        
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




  // end register 



    



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

  // reject candidate
  const rejectCandidate = async (candidateAddress) => {
  if (!contract) return;
  try {
    const tx = await contract.rejectCandidate(
      candidateAddress,
    "You have been rejected as a candidate! Update your information and try again."

  );
    await tx.wait();

    alert("Candidate rejected!");

    getRegisteredCandidates();
   
  } catch (err) {
    console.error("Error rejecting candidate:", err);
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
        //const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545"); // hardhat local node 

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const votigContract = new ethers.Contract(
          contractAddress,
          VotingArtifact.abi,
          signer);

          setContract(votigContract);

          // automatically load voters
          const list = await votigContract.ListofRegisteredCandidates();
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
                  <h1 style={{ color: "purple"}}>Candidate Management</h1>
                  <h5>Review and manage registered candidates in the system</h5>
      
                </div>
             <br/>
             <br/>

             < div style ={{marginBottom: "30px"}}>
       <h3>Search Candidate</h3>

       <input
        type="text"
        placeholder="Enter Candidate Name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        style={{ marginRight: "10px", padding: "5px"}}

       />

       <input
       type="text"
        placeholder="Enter Candidate address"
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
              width: "auto",
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
       <br/>
       <br/>
       <br/>
       <br/>
      
             
            <div className="admin-container">
              <h3 >Candidate Registry</h3>
          
              <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Home Address</th>
              <th>Political Party</th>
              <th>Goals/Manifesto</th>
              <th>Vision</th>
              <th>Experience</th>
              <th>National ID</th>
              <th>Wallet Address</th>
              <th>Status</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
      
          <tbody>
            {candidates.map((c, index) => (
              <tr key={index}>
                <td>{c.candidateName}</td>
                <td>{c.candidateAge}</td>
                <td>{c.candidateEmail}</td>
                <td>{c.candidatePhone}</td>
                <td>{c.candidateHomeAddress}</td>
                <td>{c.politicalParty}</td>
                <td>{c.goalsManifesto}</td>
                <td>{c.vision}</td>
                <td>{c.experience}</td>
                <td>{c.candidateNationalId}</td>
                <td>{c.candidatesAddress}</td>
                <td>{c.status.toString()}</td>
                <td>{c.message}</td>
                <td>
                  {c.status.toString() === "0" && (
      
                    <div style={{ color: "green", display: "inline-block", marginRight: "10px" }}>
                    <button onClick={() => approveCandidate(c.candidatesAddress)}
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
      
                  
                  {c.status.toString() === "0" && (
                   
                    <button onClick={() => rejectCandidate(c.candidatesAddress)}
                    
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

            <br/>
            <br/>
      
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
export default CandidateRegistration;    