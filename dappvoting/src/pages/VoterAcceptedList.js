import {ethers } from 'ethers';
import VotingArtifact from '../abi/VotingSystem.json';
import Container from 'react-bootstrap/Container';
import React, { useState, useEffect } from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import './VoterAcceptedList.css';
import axios from 'axios';

//const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// SEPOLIA ADDRESS INSIDE .ENV
const contractAddress = "0x65F5f54d2E24F9C9B9919D4e3cDe3fBe533D7bD5"

function VoterAcceptedList() {

  const [voterName, setVoterName] = useState('');
  const [voterAge, setVoterAge] = useState('');
  const [voterEmail, setVoterEmail] = useState('');
  const [voterPhone, setVoterPhone] = useState('');
  const [voterhomeAddress, setVoterHomeAddress] = useState('');
  const [voternationalId, setVoterNationalId] = useState('');
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
              voterEmail: res.data.email,
              voterPhone: res.data.phone,
              voterHomeAddress: res.data.address,
              voterNationalId: res.data.nationalId,
            };
            } catch (err) {
              console.error("Error fetching voter details from backend:", err);

              // fallback if IPFs fails
              return {
                ...v,
                voterName: "N/A",
                voterAge: "N/A",
                voterEmail: "N/A",
                voterPhone: "N/A",
                voterHomeAddress: "N/A",
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
    if (!contract || !voterName || !voterAge || !voterEmail || !voterPhone || !voterhomeAddress || !voternationalId ) return;
    try {

       // Upload voter data to IPFS and get the hash
        const ipfsVoterData = {
        name: voterName,
        age: voterAge,
        email: voterEmail,
        phone: voterPhone,
        address: voterhomeAddress,
        nationalId: voternationalId,
      
      };

       // Upload to IPFS and get the hash
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`,ipfsVoterData);

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
      setVoterEmail('');
      setVoterPhone('');
      setVoterHomeAddress('');
      setVoterNationalId('');

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
          const list = await votigContract.ListofAcceptedVoters();
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
                  <h1 style={{ color: "purple"}}>Verified Voters</h1>
                  <h5>List of voters who have been verified and approved in the system</h5>
      
                </div>
             <br/>
             <br/>
             < div style ={{marginBottom: "30px"}}>
       <h3>Search Verified Voter</h3>

       <input
        type="text"
        placeholder="Enter Voter Name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        style={{ marginRight: "10px", padding: "5px"}}

       />

       <input
       type="text"
        placeholder="Enter Voter address"
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
              width: "auto",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
            }}
            >
              <h4>{v.name}</h4>
              <p><b>Address:</b> {v.votersAddress}</p>
              <p><b>Status:</b> {v.status.toString()}</p>
           

              
            </div>
          ))}

       </div>
      
             <br/>
             <br/>
             <br/>
             <br/>
      
            <div className="admin-container">
              <h3 >Verified Voter Records</h3>
          
              <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Home Address</th>
              <th>National ID</th>
              <th>Wallet Address</th>
              <th>Status</th>
              <th>Message</th>
              <th>Decision</th>
            </tr>
          </thead>
      
          <tbody>
            {voters.map((v, index) => (
              <tr key={index}>
                <td>{v.voterName}</td>
                <td>{v.voterAge}</td>
                <td>{v.voterEmail}</td>
                <td>{v.voterPhone}</td>
                <td>{v.voterHomeAddress}</td>
                <td>{v.voterNationalId}</td>
                <td>{v.votersAddress}</td>
                <td>{v.status.toString()}</td>
                <td>{v.message}</td>
                <td >
                  < span className="check-emoji">✅</span>
                  </td>
                  <td>
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
export default VoterAcceptedList;