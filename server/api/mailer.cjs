//https://nodemailer.com/ for documentation
// >npm install nodemailer

// const transporter = nodemailer.createTransporter({
//   host: "smtp.gmail.com",
//   port: 587,
//   auth: {
//     type: 'OAuth2',
//     user: 'your-email@gmail.com',
//     clientId: 'your-client-id',
//     clientSecret: 'your-client-secret',
//     refreshToken: 'your-refresh-token',
//     accessToken: 'your-access-token'
//   }
// });

// Wrap in an async IIFE so we can use await.
// (async () => {
//   const info = await transporter.sendMail({
//     from: '"Kriti Raja" <rkriti16@gmail.com>',
//     to: "kxr230037@utdallas.edu, kxr230037@utdallas.edu",
//     subject: "Welcome To Reading Huddle!",
//     text: "Here is your 6 digit OTP:", // plain‑text body
//     html: "<b>Here is your 6 digit OTP:</b>", // HTML body
//   });

//   console.log("Message sent:", info.messageId);
// })();

// POST version

const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "..", "pages"))); // to serve emailregister file from pages directory ".." for moving up on

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {},
});

app.post("/send-email", async (req, res) => {
  const { to } = req.body;

  const subject = "Welcome to Reading Huddle!";
  const text = "Here is your 6-digit OTP:";
  const html = "<b>Here is your 6-digit OTP:</b>";

  try {
    const info = await transporter.sendMail({
      from: '"Your Name" <your-email@gmail.com>',
      to,
      subject,
      text,
      html,
    });

    res.status(200).json({ message: "Email sent", id: info.messageId });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
