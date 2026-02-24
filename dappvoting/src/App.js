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


//import { Link } from 'react-router-dom';

//const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  return (
    // Login Link for voters and Candidates

   <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/voter-login" element={<VoterLogin />} />
      <Route path="/candidate-login" element={<CandidateLogin />} />
      <Route path="/administrator-page" element={<AdministratorPage />} />
    </Routes>
   </Router>
  )
 
}

export default App;