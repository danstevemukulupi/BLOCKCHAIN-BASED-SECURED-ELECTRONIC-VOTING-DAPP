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
            <Nav.Link href="#link">My Profile</Nav.Link>
            <NavDropdown title="View Candidates" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">List of all candidates</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.1">List of all voted candidates</NavDropdown.Item>
              <NavDropdown.Divider />
            </NavDropdown>
            <NavDropdown title="Vote" id="basic-nav-dropdown">
              <NavDropdown.Item href="#VoterList">List of Voters</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.1">All Voted Voters</NavDropdown.Item>
              <NavDropdown.Divider />
            </NavDropdown>
            <Nav.Link href="#link">Election Infos</Nav.Link>
            <Nav.Link href="#link">Contact</Nav.Link>


            
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