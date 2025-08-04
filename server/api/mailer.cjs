//https://nodemailer.com/ for documentation
//>npm install nodemailer
// updated server side api

import nodemailer from "nodemailer";
import crypto from "crypto";
import { defineEventHandler, readBody, send, setResponseStatus } from "h3";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { to } = body;

    if (!to) {
      setResponseStatus(event, 400);
      return event, { message: "'to' field is required" };
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    console.log("sending message to; ", to);
    console.log("otp contents: ", otp);

    await prisma.oTP.upsert({
      where: { email: to },
      update: { code: otp },
      create: { email: to, code: otp },
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER, // user account
        pass: process.env.SMTP_APP_PASSWORD, // App password
      },
    });

    await transporter.sendMail({
      from: `"Reading Huddle Team" <${process.env.SMTP_USER}>`,
      to,
      subject: "Your OTP for Reading Huddle",
      text: `Your OTP is: ${otp}`,
      html: `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <!-- Header with blue background -->
        <div style="background-color: #003366; text-align: center; padding: 20px;">
          <img
            src="/image.png"
            alt="Company Logo"
            style="height: 80px; object-fit: contain; margin-bottom: 10px;"
          />
          <h1 style="color: white; font-size: 24px; margin: 0;">Welcome to Reading Huddle!</h1>
        </div>

        <!-- Main content -->
        <div style="padding: 30px;">
          <p style="font-size: 16px; margin-bottom: 10px;">Hi there,</p>

          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            We received your request to log in or sign up. Here's your one-time password (OTP):
          </p>

          <div style="font-size: 24px; font-weight: bold; color: goldenrod; text-align: center; margin: 30px 0;">
            ${otp}
          </div>

          <p style="font-size: 14px; color: #555; margin-bottom: 30px;">
            This OTP is only valid for one use. Please don’t share it with anyone.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 20px;">

          <p style="font-size: 12px; color: #888; text-align: center;">
            If you didn’t request this, please ignore this email.
          </p>
        </div>
      </div>

      `,
    });

    return event, { message: "OTP sent" };
  } catch (err) {
    console.error("Mailer error:", err);
    setResponseStatus(event, 500);

    return event, { message: "Server error: " + err.message };
  }
});
