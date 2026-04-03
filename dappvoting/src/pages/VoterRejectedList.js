import { ethers } from "ethers";
import VotingArtifact from '../abi/VotingSystem.json';
import { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import './VoterRejectedList.css';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function VoterRejectedList() {

    const [voterName, setVoterName] = useState('');
    const [voterAge, setVoterAge] = useState('');
    const [voterEmail, setVoterEmail] = useState('');
    const [voterPhone, setVoterPhone] = useState('');
    const [voters, setVoters] = useState([]);
    const [contract, setContract] = useState(null);

    return(
        <Navbar expand = "lg" className='navbarColour'>
      <Container>
        <Navbar.Brand href="#home"> Voters Rejected List </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="my-center-nav">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/administrator-page">Dashboard</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    )
}
export default VoterRejectedList;