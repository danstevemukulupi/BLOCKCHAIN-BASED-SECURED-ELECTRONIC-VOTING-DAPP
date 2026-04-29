import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import './AdministrationGuide.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';

function AdministrationGuide() {

    return(

        <div className="App">
            <div className="topnav">
               <a>
                    <img src="./pics/MapoVote-nobackground.png" alt="logo" width={150} height={60} />
               </a>
                <h2 style={{ color: "purple" }}>MapoVote</h2>
                <Link to="/">Home</Link>
               
               
            </div>
            <br/>
            <br/>
        
            <div className="voter-container">
              <h1 style={{ color: "purple"}}>Guide to MapoVote</h1>
              <h5>Step-by-step instructions on how to participate in the electoral process, from registration to casting your ballot.</h5>
            </div>
        
            <br/>
            <br/>

            <div className="guide-container">

  {/* ================= ADMIN ACCESS ================= */}
  <div className="guide-section">
    <h2 className="section-title">🔐 Administrator Access</h2>

    <div className="section-grid">
      <div className="info-card">
        <h4>Secure Login</h4>
        <ul>
          <li>Select the designated <b>Administrator account</b></li>
          <li>Click <b>Connect Wallet</b></li>
          <li>If authorized → access granted</li>
          <li>If not → <span className="error">Access denied</span></li>
        </ul>
      </div>

      <div className="info-card">
        <h4>Connection Status</h4>
        <p>
          Once connected successfully, a <span className="success">green indicator</span> will appear.
        </p>
        <p>This confirms your identity on the blockchain.</p>
      </div>
    </div>
  </div>


  {/* ================= ROLE ================= */}
  <div className="guide-section">
    <h2 className="section-title">🛠️ Administrator Responsibilities</h2>

    <div className="section-grid">
      <div className="info-card">
        <h4>Manage Users</h4>
        <ul>
          <li>Approve or reject voters</li>
          <li>Approve or reject candidates</li>
        </ul>
      </div>

      <div className="info-card">
        <h4>Publish Announcements</h4>
        <ul>
          <li>Create election messages</li>
          <li>Visible on:
            <ul>
              <li>Dashboard</li>
              <li>How to Vote page</li>
              <li>Help & Info</li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="info-card">
        <h4>System Control</h4>
        <ul>
          <li>Start election</li>
          <li>Monitor voting</li>
          <li>Publish results</li>
          <li>Reset system</li>
        </ul>
      </div>
    </div>
  </div>


  {/* ================= DASHBOARD ================= */}
  <div className="guide-section">
    <h2 className="section-title">📊 Admin Dashboard Overview</h2>

    <div className="section-grid">
      <div className="info-card">
        <h4>Dashboard Metrics</h4>
        <ul>
          <li>Total Registered Voters</li>
          <li>Approved Voters</li>
          <li>Rejected Voters</li>
          <li>Total Candidates</li>
          <li>Approved Candidates</li>
          <li>Rejected Candidates</li>
        </ul>
      </div>

      <div className="info-card">
        <h4>Announcement Panel</h4>
        <ul>
          <li>Enter election message</li>
          <li>Click <b>Publish</b></li>
          <li>Alert: <b>"Announcement saved"</b></li>
        </ul>
      </div>

      <div className="info-card">
        <h4>Navigation</h4>
        <ul>
          <li>Home → Main page</li>
          <li>Guide → This page</li>
          <li>Voters & Candidates dropdown</li>
        </ul>
      </div>
    </div>
  </div>


  {/* ================= USER MANAGEMENT ================= */}
  <div className="guide-section">
    <h2 className="section-title">👥 Managing Voters & Candidates</h2>

    <div className="section-grid">
      <div className="info-card">
        <h4>Registered Lists</h4>
        <ul>
          <li>View full details from IPFS</li>
          <li>Includes wallet address</li>
        </ul>
      </div>

      <div className="info-card">
        <h4>Approval Process</h4>
        <ul>
          <li>Click <b>Approve</b> or <b>Reject</b></li>
          <li>MetaMask confirmation required</li>
          <li>Status updates immediately</li>
        </ul>
      </div>

      <div className="info-card">
        <h4>Status Indicators</h4>
        <ul>
          <li><span className="success">✔ Approved</span></li>
          <li><span className="error">✖ Rejected</span></li>
        </ul>
      </div>
    </div>

    <div className="info-sub">
      ⚠️ Approved candidate list hides sensitive data (email, phone, ID)
    </div>
  </div>


  {/* ================= ELECTION CONTROL ================= */}
  <div className="guide-section">
    <h2 className="section-title">⏱️ Starting an Election</h2>

    <div className="section-grid">
      <div className="info-card">
        <h4>Setup Steps</h4>
        <ul>
          <li>Connect admin wallet</li>
          <li>View current blockchain time</li>
          <li>Start time must be in the future</li>
          <li>Recommended: +10 minutes minimum</li>
        </ul>
      </div>

      <div className="info-card">
        <h4>Time Configuration</h4>
        <ul>
          <li>Set Start Date & Time</li>
          <li>Set End Date & Time</li>
          <li>End must be after start</li>
        </ul>
      </div>

      <div className="info-card">
        <h4>Launch Election</h4>
        <ul>
          <li>Click <b>Start Election</b></li>
          <li>Confirm in MetaMask</li>
          <li>Alert: <b>"Election time set successfully"</b></li>
        </ul>
      </div>
    </div>
  </div>


  {/* ================= ELECTION FLOW ================= */}
  <div className="guide-section">
    <h2 className="section-title">🗳️ Election Lifecycle</h2>

    <div className="section-grid">
      <div className="info-card">
        <h4>Before Start</h4>
        <p>“Election will start soon” message displayed</p>
      </div>

      <div className="info-card">
        <h4>During Voting</h4>
        <p className="success">Voting is active</p>
        <p>Voters must use their approved account</p>
      </div>

      <div className="info-card">
        <h4>After End</h4>
        <p>Voting closes automatically</p>
        <p>Results are published</p>
      </div>
    </div>
  </div>


  {/* ================= RESET ================= */}
  <div className="guide-section">
    <h2 className="section-title">♻️ Reset Election System</h2>

    <div className="section-grid">
      <div className="info-card">
        <h4>Reset Rules</h4>
        <ul>
          <li>Only available after election ends</li>
          <li>Disabled during active voting</li>
        </ul>
      </div>

      <div className="info-card">
        <h4>Reset Process</h4>
        <ul>
          <li>Click <b>Reset Election</b></li>
          <li>Type <b>RESET</b> to confirm</li>
          <li>Approve via MetaMask</li>
          <li>Alert confirms reset</li>
        </ul>
      </div>

      <div className="info-card">
        <h4>Result</h4>
        <p>All election data is permanently cleared</p>
        <p>System ready for new election cycle</p>
      </div>
    </div>
  </div>

</div>
        
          
        
        
        
        
            
        
             <br/>
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
            

    )
}

export default AdministrationGuide;