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
        <Link to="/voter-profile">Profile</Link>
       
       
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
    

    )
}
export default VoteInfo;