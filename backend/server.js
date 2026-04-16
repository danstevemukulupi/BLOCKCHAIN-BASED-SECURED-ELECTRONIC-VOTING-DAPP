

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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
