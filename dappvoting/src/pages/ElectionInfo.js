import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import './ElectionInfo.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';

function ElectionInfo() {

  const [announcement, setAnnouncement] = useState("");

       // annoucement 
      useEffect(() => {
  const fetchAnnouncement = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/announcement`
      );
      setAnnouncement(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  fetchAnnouncement();
}, []);


    return(
        <div className="App">
    <div className="topnav">
       <a>
            <img src="./pics/MapoVote-nobackground.png" alt="logo" width={150} height={60} />
       </a>
        <h2 style={{ color: "purple" }}>MapoVote</h2>
        <Link to="/">Home</Link>
      
    </div>
    <br/>
    <br/>

    <div className="voter-container">
      <h1 style={{ color: "purple"}}>Election Information</h1>
      <h5>A comprehensive overview of the electoral process, including voting details, candidate information, and important deadlines.</h5>
    </div>
    <br/>
    <br/>
    
     <div className="announcement-display">
  <h3>📢 Latest Announcement</h3>
  <p>{announcement || "No announcements yet."}</p>
  </div>

    <br/>
    <br/>


     <div className="voter-content">

       {/* GETTING STARTED */}
  <div className="info-card">
    <h2>🔐 Getting Started with MapoVote</h2>

    <h4>1. Install MetaMask Wallet</h4>
    <ul>
      <li>Download MetaMask (Chrome, Edge, Firefox)</li>
      <li>Create a new wallet account</li>
      <li>Securely store your recovery phrase</li>
      <li>Connect to the Sepolia Test Network</li>
    </ul>

    <p className="info-note">
      👉 Your wallet acts as your digital identity in the system.
    </p>
  </div>

  {/* REGISTRATION */}
  <div className="info-card">
    <h2>🧾 Registration Process</h2>
    <p>
      All users must register before accessing the platform as either a:
    </p>
    <ul>
      <li>👤 Voter</li>
      <li>🏛️ Candidate</li>
    </ul>

    <p className="warning">
      ⚠️ Registration requires a connected MetaMask wallet.
    </p>
  </div>

  {/* VOTER */}
  <div className="info-card">
    <h2>👤 Voter Registration Requirements</h2>
    <ul>
      <li>Full Name</li>
      <li>Age (must be 18 or older)</li>
      <li>Email Address</li>
      <li>Phone Number</li>
      <li>Residential Address</li>
      <li>National ID Number</li>
    </ul>

    <div className="info-sub">
      <h4>🧠 Important Notes</h4>
      <ul>
        <li>Wallet must be connected before registration</li>
        <li>Data is stored securely on IPFS</li>
        <li>Only a hash is stored on the blockchain</li>
      </ul>
    </div>
  </div>

  {/* CANDIDATE */}
  <div className="info-card">
    <h2>🏛️ Candidate Registration Requirements</h2>
    <ul>
      <li>Full Name</li>
      <li>Age</li>
      <li>Email Address</li>
      <li>Phone Number</li>
      <li>Residential Address</li>
      <li>Political Party</li>
      <li>Goals / Manifesto</li>
      <li>Vision</li>
      <li>Experience</li>
      <li>National ID Number</li>
    </ul>

    <div className="info-sub">
      <h4>🧠 Important Notes</h4>
      <ul>
        <li>Same approval process as voters</li>
        <li>Information helps voters make decisions</li>
      </ul>
    </div>
  </div>

  {/* CONFIRMATION */}
  <div className="info-card">
    <h2>⚙️ Registration Confirmation</h2>
    <ul>
      <li>MetaMask popup will appear → Confirm transaction</li>
      <li>Browser alert will show confirmation message</li>
      <li>Click OK to proceed</li>
    </ul>
  </div>

  {/* APPROVAL */}
  <div className="info-card">
    <h2>⏳ Approval Process</h2>
    <ul>
      <li>Reviewed by Administrator</li>
      <li>May take up to 1 hour</li>
      <li>Result:</li>
      <li>✅ Approved</li>
      <li>❌ Rejected</li>
    </ul>
  </div>

  {/* ACCESS */}
  <div className="info-card">
    <h2>🔑 Accessing Your Account</h2>
    <ul>
      <li>Click "Connect Wallet"</li>
      <li>Use the same MetaMask account</li>
    </ul>

    <p className="success">✅ Approved users gain dashboard access</p>
    <p className="error">❌ Unapproved users cannot access the system</p>
  </div>

  {/* WALLET STATUS */}
  <div className="info-card">
    <h2>🟢 Wallet Connection Status</h2>
    <p>
      A green indicator confirms:
    </p>
    <p className="success">“Wallet Connected”</p>
  </div>

  {/* SECURITY */}
  <div className="info-card">
    <h2>🔐 Security & Transparency</h2>
    <ul>
      <li>All actions recorded on blockchain</li>
      <li>Smart contracts ensure integrity</li>
      <li>Data stored securely using IPFS</li>
    </ul>

    <p className="info-note">
      System guarantees transparency, tamper-proof records, and decentralized verification.
    </p>
  </div>
     </div>
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
export default ElectionInfo;