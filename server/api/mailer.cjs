//https://nodemailer.com/ for documentation
//>npm install nodemailer
// updated server side api

import nodemailer from "nodemailer";
import crypto from "crypto";
import { readBody, send, setResponseStatus } from "h3";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (event) => {
  try {
    const body = await readBody(event);
    const { to } = body;

    if (!to) {
      setResponseStatus(event, 400);
      return send(event, { message: "'to' field is required" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "rkriti16@gmail.com",
        pass: "", // App password
      },
    });

    await transporter.sendMail({
      from: '"Kriti Raja" <rkriti16@gmail.com>',
      to,
      subject: "Your OTP for Reading Huddle",
      text: `Your OTP is: ${otp}`,
      html: `<b>Your OTP is: ${otp}</b>`,
    });

    return send(event, { message: "OTP sent" });
  } catch (err) {
    console.error("Mailer error:", err);
    setResponseStatus(event, 500);
    return send(event, { message: "Server error: " + err.message });
  }
};
