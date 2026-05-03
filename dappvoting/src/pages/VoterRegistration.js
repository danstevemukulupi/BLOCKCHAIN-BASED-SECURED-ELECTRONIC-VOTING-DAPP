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
//import { use } from 'chai';
import axios from 'axios';



//const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// sepolia address
//const contractAddress = "0x65F5f54d2E24F9C9B9919D4e3cDe3fBe533D7bD5"
//const contractAddress = "0x110Ba63afa08375042910EC633fb2DA7A16F51B0"
const contractAddress = "0x6C2491333473C79d59d9f0F32e327C28431D04A6" // 3

function VoterRegistration() {


  const [voterName, setVoterName] = useState('');
  const [voterAge, setVoterAge] = useState('');
  const [voterGender, setVoterGender] = useState('');
  const [voterCountry, setVoterCountry] = useState('');
  const [voterCounty, setVoterCounty] = useState('');
  const [voternationalId, setVoterNationalId] = useState('');

  const [voters, setVoters] = useState([]);
  const [contract, setContract] = useState(null);

  // new 
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [ searchResult, setSearchResult] = useState([]);
  const [ newName, setNewName] = useState(''); 

  const [votingStartTime, setVotingStartTime] = useState(0);

  // end new
  // 
  const currentTime = Math.floor(Date.now() / 1000);
  
  // find and update voter information
  const searchVoter = async () => {
    if (!contract || !searchAddress) return;

    try {

      // clean (handles, tabs, spaces, newlines
      const cleanAddress = searchAddress.replace(/\s/g, "");

      // validates address 
      if (!ethers.utils.isAddress(cleanAddress)) {
        alert("Invalid wallet address format!"); 
        return; 
      }

      const result = await contract.searchVoter(cleanAddress);
      console.log("SEARCH RESULT FROM CONTRACT:", result);

      if (!result || result.votersAddress === ethers.constants.AddressZero) {
        alert("Voter not found!");
        setSearchResult([]);
        return;
      }
      setSearchResult([result]);
    } catch (err) {
      console.error("Error searching voter:", err);
      setSearchResult([]); 

    }
  };
  // end find and update voter information

  // update voter information
  const updateMyName = async (voterAddress) => {
    if (!contract) return;

    try {
      const updatedData = {
        name: newName,
        age: voterAge,
        gender: voterGender,
        country: voterCountry,
        county: voterCounty,
        nationalId: voternationalId,
      }; 
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/upload`,
        updatedData
      )

      if (!response.data?.IpfsHash) {
        throw new Error("IPFS upload failed or missing IpfsHash");

      }

      const newIpfsHash = response.data.IpfsHash;

      const tx = await contract.updateVoter(
        voterAddress,
        newIpfsHash
      );

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
  {/*const getRegisteredVoters = async () => {
    if (!contract) return;
    try {
      const list = await contract.ListofRegisteredVoters();
      setVoters(list);
    } catch (err) {
      console.error("Error fetching voters:", err);
    }
  };*/}


  // try
  // Fetch registered voters
    const getRegisteredVoters = async () => {
      if (!contract) return;
      try {
        const list = await contract.ListofRegisteredVoters();
        
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
  
  


  // end




 {/*
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
  };*/}


  // new register voter function with IPFS integration
  // Register Voter
  const registerVoter = async () => {
    //if (!contract || !voterName) return;
    if (!contract || !voterName || !voterAge || !voterGender  || !voterCountry || !voterCounty || !voternationalId ) return;
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
        const response = await axios.post(
  `${process.env.REACT_APP_API_URL}/upload`,
  ipfsVoterData
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




  // end register 



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

          // get current time in seconds
          
          // get start time 
          const startTime = await votigContract.votingStartTime();
          setVotingStartTime(Number(startTime));

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
       

     

   {/*}
       < div style ={{marginBottom: "30px"}}>
       <h3>Search Voter</h3>


       <input
       type="text"
        placeholder="Enter Wallet Address"
        value={searchAddress}
        onChange={(e) => setSearchAddress(e.target.value.replace(/\s/g, ""))} // remove spaces
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
       */}

       {/*}
       <div style={{ display: "flex", gap: "20px", flexWrap: "wrap"}}>
        {
          searchResult.map((v, index) => (
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
              <h4>{v.name}</h4>
              <p><b>Address:</b> {v.votersAddress}</p>
              <p><b>Status:</b> {v.status.toString()}</p>
              <p><b>Message:</b> {v.message}</p>*/}

              {/* update section */}
              {/*}
              <input 
              type="text"
              placeholder="New name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ marginRight: "10px", padding: "5px", width: "100%" }}  
              />

              <button 
              onClick={() => updateMyName(v.votersAddress)} 
              disabled={currentTime >= votingStartTime}
              style={{
                marginTop: "10px",
                background: currentTime >= votingStartTime ? "gray" : "blue",
                color: "white", 
                padding: "6px",
                border: "none",
                borderRadius: "6px",
                width: "100%",
                cursor: currentTime >= votingStartTime ? "not-allowed" : "pointer"
              }}
              >
                Update Name
              </button>
            </div>
          ))}

       </div>*/}
       <br/>
       <br/>
       <br/>
       <br/>

      <div className="admin-container">
        <h3 >Voter Registry</h3>
    
        <table className="table">
    <thead>
      <tr>
        
        <th>Name</th>
        <th>Age</th>
        <th>Gender</th>
        <th>Country</th>
        <th>County</th>
        <th>National ID</th>
        <th>Wallet Address</th>
        <th>Status</th>
        <th>Message</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {voters.map((v, index) => (
        <tr key={index}>
          <td>{v.voterName}</td>
          <td>{v.voterAge}</td>
          <td>{v.voterGender}</td>
          <td>{v.voterCountry}</td>
          <td>{v.voterCounty}</td>
          <td>{v.voterNationalId}</td>
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
       <br/>
       <br/>
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

export default VoterRegistration;