import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import './VoteInfo.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';

function VoteInfo() {

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
      <h1 style={{ color: "purple"}}>Guide to Voting</h1>
      <h5>Step-by-step instructions on how to participate in the electoral process, from registration to casting your ballot.</h5>
    </div>

    <br/>
    <br/>

    <div className="announcement-display">
  <h3>📢 Latest Announcement</h3>
  <p>{announcement || "No announcements yet."}</p>
  </div>
  <br/>
  <br/>




     <div className="how-to-vote-container">
      <h2>🗳️ How to Vote</h2>

  <ul>
    <li>Each voter is allowed <b>one vote per registered wallet</b></li>
    <li>Wait until the election is officially started by the administrator</li>
    <li>Once active, the list of approved candidates will be displayed</li>
    <li>Ensure you are connected using your <b>approved MetaMask account</b></li>
  </ul>

  <h4>📌 Voting Steps</h4>
  <ol>
    <li>Select your preferred candidate</li>
    <li>Click the <b>"Vote"</b> button</li>
    <li>A MetaMask popup will appear</li>
    <li>Review and click <b>"Confirm"</b> to submit your vote</li>
    <li>A browser alert will confirm: <b>"You have voted successfully"</b></li>
  </ol>

  <h4>⚠️ Important Rules</h4>
  <ul>
    <li>You can only vote <b>once</b></li>
    <li>Your vote <b>cannot be changed or undone</b></li>
    <li>Duplicate voting is automatically prevented by the blockchain</li>
  </ul>

  <h4>📊 After Voting</h4>
  <ul>
    <li>Wait for the election period to end</li>
    <li>Visit the dashboard to view results</li>
    <li>You will see:</li>
    <ul>
      <li>Winner’s name</li>
      <li>Political party</li>
      <li>Total votes received</li>
      <li>Total number of candidates</li>
      <li>Total number of voters</li>
    </ul>
  </ul>

  <p className="info-note">
    All votes are securely recorded on the blockchain, ensuring fairness, transparency, 
    and that every vote is counted exactly once.
  </p>

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
export default VoteInfo;