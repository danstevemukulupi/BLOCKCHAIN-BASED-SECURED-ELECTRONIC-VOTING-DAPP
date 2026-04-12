import React, { useState } from "react";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './VoterLogin.css';


function VoterLogin() {

    const [voterEmail, setVoterEmail] = useState('');
    const [voterPassword, setVoterPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        // Login Logic
        console.log("Voter Email:", voterEmail, "Voter Password:", voterPassword);
        alert("Voter logged in successfully!");

    };

  return (
 
    

 

<div className="App">
    <div className="topnav">
       <a>
            <img src="./pics/MapoVote-nobackground.png" alt="logo" width={150} height={60} />
       </a>
        <h2 style={{ color: "purple" }}>MapoVote</h2>
        <Link to="/">Home</Link>
        <Link to="/voter-profile">Profile</Link>
        <NavDropdown title="Election" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/election-info">Election Info</NavDropdown.Item>  
              <NavDropdown.Item as={Link} to="/candidate-accepted-list">View Candidates</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/election-info">Election Info</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/vote-info">How To Vote</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/vote-status">Voting Status</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/vote-result"> Election Result </NavDropdown.Item> 
              <NavDropdown.Divider />
            </NavDropdown>
       <button>Connect Wallet</button>
    </div>
    <br/>
    <br/>

    <div className="voter-container">
      <h1 style={{ color: "purple"}}>Welcome, Voter!</h1>
      <h5>Your portal for participation in the upcoming general election.</h5>
    </div>


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

   /*<div >
      <h2>Voter Login</h2>
    
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter Email"
          value={voterEmail}
          onChange={(e) => setVoterEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={voterPassword}
          onChange={(e) => setVoterPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <br />

      <Link to ="/"> Back to Home</Link>
    </div>*/


  );
}

export default VoterLogin;