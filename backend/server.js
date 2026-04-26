

/*import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

// server  configuration
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure nodemailer transporter with environment variables for email and password
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

// Endpoint to send email notifications
app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    await transporter.sendMail({
      from: `Mapovote <${process.env.EMAIL}>`,
      to,
      subject,
      text
    });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});*/

//import express from "express";
//import cors from "cors";
//import dotenv from "dotenv";
//import emailRoutes from "./routes/emailRoutes.js";

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const emailRoutes = require("./routes/emailRoutes");
const axios = require("axios");


dotenv.config();



const app = express();

app.use(cors());
app.use(express.json());

// Root test
app.get("/", (req, res) => {
  res.send("Welcome to the Mapovote backend server!");
});

// routes 
app.post("/upload", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      req.body,
      {
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);

  } catch (err) {
    console.log("🔥 PINATA ERROR FULL DETAILS:");
    console.log("Status:", err.response?.status);
    console.log("Data:", err.response?.data);
    console.log("Message:", err.message);

    return res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
});

// routes
app.use("/api", emailRoutes);

// get voters list from the contract
const fetch = require("node-fetch");

app.get("/voter/:hash", async (req, res) => {
  try {
    const hash = req.params.hash;
    console.log("Fetching hash:", hash);

    const response = await axios.get(`https://api.pinata.cloud/data/pinList?hashContains=${hash}`,
      {
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
      
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Gateway responded with ${response.status} `); 
    }
    const data = await response.json();
     res.json(data);
  


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch from IPFS" });
  }
});

app.get("/debug-env", (req, res) => {
  res.json({
    pinata_key_set: !!process.env.PINATA_API_KEY,
    pinata_secret_set: !!process.env.PINATA_SECRET_API_KEY,
    pinata_key_preview: process.env.PINATA_API_KEY?.slice(0, 6) + "...",
  });
});




//get candidates list from the contract
//const fetch = require("node-fetch");

app.get("/candidate/:hash", async (req, res) => {
  try {
    const hash = req.params.hash;

    const response = await fetch(`https://ipfs.io/ipfs/${hash}`);
    const data = await response.json();

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch from IPFS" });
  }
});







//app.listen(5000, () => { // working good
  //console.log("Server running on port 5000"); // working good

  // trying new port for deployment
  const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});



