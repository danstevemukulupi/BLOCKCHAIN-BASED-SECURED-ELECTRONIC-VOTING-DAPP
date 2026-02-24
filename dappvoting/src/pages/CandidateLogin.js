
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
   
     <Navbar expand = "lg" className='navbarColour'>
      <Container>
        <Navbar.Brand href="#home">Registered Candidates </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="my-center-nav">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#link">My Profile</Nav.Link>
            <Nav.Link href="#link">Election Infos</Nav.Link>
            <NavDropdown title="Candidates " id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">View Candidates</NavDropdown.Item>
              <NavDropdown.Divider />
            </NavDropdown>
            <Nav.Link href="#link">Contact</Nav.Link>
 

           
           <button>Connect Wallet</button>
          

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    


  );
}
export default CandidateLogin;