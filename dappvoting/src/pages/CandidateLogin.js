
//import React, { useState, useContext } from "react";
//import { Link } from "react-router-dom";


import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import './CandidateLogin.css';

function CandidateLogin() {
  return (
 
    
  

  <div className="App">
    <div className="topnav">
       <a>
            <img src="./pics/MapoVote-nobackground.png" alt="logo" width={150} height={60} />
       </a>
        <h2 style={{ color: "purple" }}>MapoVote</h2>
        <Link to="/">Home</Link>
        <Link to="/candidate-profile">Profile</Link>
        <NavDropdown title="Election" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/election-info">Election Info</NavDropdown.Item>   
              <NavDropdown.Divider />
            </NavDropdown>
       <button>Connect Wallet</button>
    </div>
    <br/>
    <br/>

    <div className="candidate-container">
      <h1 style={{ color: "purple"}}>Candidate Command Center</h1>
      <h5>Welcome, Candidate! Here you can manage your profile, view election details.</h5>
      <div className="candidate-container-child">

      </div>
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

  );
}
export default CandidateLogin;