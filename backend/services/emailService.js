import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to, subject, text) => {
  return transporter.sendMail({
    from: `MapoVote <${process.env.EMAIL}>`,
    to,
    subject,
    text,
  });
};