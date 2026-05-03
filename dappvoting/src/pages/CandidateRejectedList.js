import {ethers } from 'ethers';
import VotingArtifact from '../abi/VotingSystem.json';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import './CandidateRejectedList.css';
import axios from 'axios'; 

//const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
//const contractAddress = "0x110Ba63afa08375042910EC633fb2DA7A16F51B0" // new
//const contractAddress = "0x6C2491333473C79d59d9f0F32e327C28431D04A6" // 3
const contractAddress = "0xAD50B47AeCCC915CFFA0C06aaBe157c50d508828" // 4

function CandidateRejectedList() {

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
        const list = await contract.ListofRejectedCandidates();
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

  // Fetch registered candidates
    // Fetch registered candidates with details from backend
  const getRegisteredCandidates = async () => {
      if (!contract) return;
      try {
        const list = await contract.ListofRejectedCandidates();
        
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
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, ipfsCandidateData );

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


  //Fetch registered candidates


   //reject candidate
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
          const list = await votigContract.ListofRejectedCandidates();
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

useEffect(() => {
      getRegisteredCandidates();
    }, [])





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
                        <h1 style={{ color: "purple"}}>Rejected Candidates</h1>
                        <h5>List of candidates who have been rejected from the system</h5>
            
                      </div>
                   <br/>
                   <br/>

        {/*
                    < div style ={{marginBottom: "30px"}}>
       <h3>Search Rejected Candidate</h3>

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
             

              
            </div>
          ))}

       </div>
       */}

       <br/>
       <br/>
       <br/>
       <br/>


            
                  <div className="admin-container">
                    <h3 >Rejected Candidate Records</h3>
                
                    <table className="table">
                <thead>
                  <tr>
                     <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Country</th>
                    <th>County</th>
                    <th>Political Party</th>
                    <th>Goals/Manifesto</th>
                    <th>Vision</th>
                    <th>Experience</th>
                    <th>National ID</th>
                    <th>Wallet Address</th>
                    <th>Status</th>
                    <th>Message</th>
                    <th>Decision</th>
                   
                  </tr>
                </thead>
            
                <tbody>
                  {candidates.map((c, index) => (
                    <tr key={index}>
                      <td>{c.candidateName}</td>
                        <td>{c.candidateAge}</td>
                        <td>{c.candidateGender}</td>
                        <td>{c.candidateCountry}</td>
                        <td>{c.candidateCounty}</td>
                        <td>{c.politicalParty}</td>
                        <td>{c.goalsManifesto}</td>
                        <td>{c.vision}</td>
                        <td>{c.experience}</td>
                        <td>{c.candidateNationalId}</td>
                        <td>{c.candidatesAddress}</td>
                        <td>{c.status.toString()}</td>
                        <td>{c.message}</td>
                        <td >
                          < span class="check-emoji">❌</span>
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
export default CandidateRejectedList;
