import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './VoteStatus.css'; 

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function VoteStatus() {


  const [leader, setLeader] = useState(null);
  const [contract, setContract] = useState(null);


  const loadStatus = async () => {

    //try {
      //const contract = await getContract();
      //const data = await contract.CurrentVotingStatus();

      if (!contract) return;
      try {
        const data = await contract.CurrentVotingStatus();

      setLeader(data);
    } catch (error) {
      console.error('Error loading leader:', error);
    }
  };

  useEffect(() => {
    loadStatus();
  //}, []);

  // refresh every 5 seconds can also be removed if  do not need it. 
  const interval = setInterval(loadStatus, 5000);
  return () => clearInterval(interval);
}, []);

    return(
      <> 
        <Navbar expand = "lg" className='navbarColour'>
      <Container>
        <Navbar.Brand href="#home"> Voting Status </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="my-center-nav">
            <Nav.Link href="/">Home</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <Container className="mt-4">
      <h2>📊 Current Leader</h2>
      {leader ? (
        <div>
          <p><strong>Name:</strong> {leader.name}</p>
          <p><strong>Votes:</strong> {leader.voteCalculation.toString()}</p>
        </div>
      ) : (
        <p>Loading.....</p>
      )}
    </Container>
     </>
    )
}
export default VoteStatus;