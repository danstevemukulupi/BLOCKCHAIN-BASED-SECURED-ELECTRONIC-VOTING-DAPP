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
    <Navbar expand = "lg" className='navbarColour'>
      <Container>
        <Navbar.Brand href="#home">Registered Voters</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="my-center-nav">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/voter-profile">My Profile</Nav.Link>
            <NavDropdown title="Election" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/candidate-accepted-list">View Candidates</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/election-info">Election Info</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/vote-info">How To Vote</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/vote-status">Voting Status</NavDropdown.Item>

              <NavDropdown.Divider />
            </NavDropdown>
            
           <button>Connect Wallet</button>
          

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    

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