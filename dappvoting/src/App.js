/*import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import VoterRegistration from './pages/VoterRegistration';
import CandidateRegistration from './pages/CandidateRegistration';
import Administrator from './pages/administrator';
import { AppProvider } from "./context/AppContext";

function App() {

  return (
  <AppProvider>
    <Router>
      

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/voter-registration" element={<VoterRegistration />} />

        <Route path="/candidate-registration" element={<CandidateRegistration />} />

        <Route path="/administrator" element={<Administrator />} />

      </Routes>

    </Router>

      </AppProvider>

  );

}

export default App;
*/

/* OLD */ 



import './App.css';
//import { ethers } from 'ethers';
//import { useState, useEffect } from 'react';
//import VotingArtifact from './abi/VotingSystem.json';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VoterLogin from './pages/VoterLogin';
import CandidateLogin from './pages/CandidateLogin';
import Dashboard from './pages/Dashboard';
import AdministratorPage from './pages/AdministratorPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import CandidateRegistration from './pages/CandidateRegistration';
import VoterRegistration from './pages/VoterRegistration';
import VoterApproval from './pages/VoterApproval';
import VoterRejection from './pages/VoterRejection';
import VoterAcceptedList from './pages/VoterAcceptedList';
import VoterRejectedList from './pages/VoterRejectedList';
import VoterFinderr from './pages/VoterFinderr';
import VoterProfile from './pages/VoterProfile';

import CandidateApproval from './pages/CandidateApproval';
import CandidateRejection from './pages/CandidateRejection';
import CandidateAcceptedList from './pages/CandidateAcceptedList';
import CandidateRejectedList from './pages/CandidateRejectedList';
import CandidateFinder from './pages/CandidateFinder';
import CandidateProfile from './pages/CandidateProfile';

import ElectionInfo from './pages/ElectionInfo';
import VoteInfo from './pages/VoteInfo';
import VoteStatus from './pages/VoteStatus';

import StartElection from './pages/StartElection';
import StartVoting from './pages/StartVoting';

import VoteResult from './pages/VoteResult';
import AdministrationGuide from './pages/AdministrationGuide'; 


//import { Link } from 'react-router-dom';

//const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  return (
    // Login Link for voters and Candidates

   <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/administrator-page" element={<AdministratorPage />} />

      <Route path="/voter-login" element={<VoterLogin />} />
      <Route path="/voter-registration" element={<VoterRegistration />} />

      <Route path="/voter-approval" element={<VoterApproval />} />
      <Route path="/voter-rejection" element={<VoterRejection />} />
      <Route path="/voter-accepted-list" element={<VoterAcceptedList />} />
      <Route path="/voter-rejected-list" element={<VoterRejectedList />} />
      <Route path="/voter-finderr" element={<VoterFinderr />} />
       <Route path="/voter-profile" element={<VoterProfile />} />

      <Route path="/candidate-login" element={<CandidateLogin />} />
      <Route path="/candidate-registration" element={<CandidateRegistration />} />
      <Route path="/candidate-approval" element={<CandidateApproval />} />
      <Route path="/candidate-rejection" element={<CandidateRejection />} />
      <Route path="/candidate-accepted-list" element={<CandidateAcceptedList />} />
      <Route path="/candidate-rejected-list" element={<CandidateRejectedList />} />
      <Route path="/candidate-finder" element={<CandidateFinder />} />
      <Route path="/candidate-profile" element={<CandidateProfile />} />
      
      <Route path="/election-info" element={<ElectionInfo />} />
      <Route path="/vote-info" element={<VoteInfo />} />
      <Route path="/vote-status" element={<VoteStatus />} />

      <Route path="/start-election" element={<StartElection />} />
      <Route path="/start-voting" element={<StartVoting />} />

      <Route path="/vote-result" element={<VoteResult />} />
      <Route path="/administration-guide" element={<AdministrationGuide />} />
    </Routes>
   </Router>
  )
}
 

export default App;