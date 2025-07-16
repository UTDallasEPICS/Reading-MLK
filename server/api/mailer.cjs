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
      html: `
        <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px; padding: 30px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #003366;">Welcome to Reading Huddle!</h1>
          </div>
          
          <p style="font-size: 16px;">Hi there,</p>

          <p style="font-size: 16px; line-height: 1.5;">
            We received your request to log in or sign up. Here's your one-time password (OTP):
          </p>

          <div style="font-size: 24px; font-weight: bold; color: goldenrod; text-align: center; margin: 30px 0;">
            ${otp}
          </div>

          <p style="font-size: 14px; color: #555;">
            This OTP is valid for 10 minutes. Please don’t share it with anyone.
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

          <p style="font-size: 12px; color: #888; text-align: center;">
            If you didn’t request this, please ignore this email.
          </p>
        </div>
      `,
    });

    return send(event, { message: "OTP sent" });
  } catch (err) {
    console.error("Mailer error:", err);
    setResponseStatus(event, 500);
    return send(event, { message: "Server error: " + err.message });
  }
};
