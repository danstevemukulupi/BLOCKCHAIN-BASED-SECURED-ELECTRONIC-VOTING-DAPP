//import express from "express";
//import { sendEmail } from "../services/emailService.js";

const express = require("express");

const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    await sendEmail(to, subject, text);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

module.exports = router;
