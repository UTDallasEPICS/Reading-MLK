// Mailer endpoint (ESM) for Nuxt/Nitro server
// Uses nodemailer and Prisma to store/refresh OTP codes.
import nodemailer from "nodemailer";
import crypto from "crypto";
import { defineEventHandler, readBody, setResponseStatus } from "h3";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Helper: get raw request body as string
  const getRawBody = async () => {
    const req = event.node.req;
    return await new Promise((resolve, reject) => {
      let data = "";
      req.on && req.on("data", (chunk) => (data += chunk));
      req.on && req.on("end", () => resolve(data));
      req.on && req.on("error", (err) => reject(err));
    });
  };

  // Helper: try multiple ways to parse the incoming request body
  const parseBody = async () => {
    try {
      const b = await readBody(event);
      // readBody may already return an object
      if (b && typeof b === "object") return b;
      if (typeof b === "string") {
        try {
          return JSON.parse(b);
        } catch (e) {
          // try urlencoded
          const params = new URLSearchParams(b);
          if (params.has("to")) return Object.fromEntries(params.entries());
        }
      }
    } catch (e) {
      // readBody threw — fallthrough to raw parsing
    }

    // fallback: read raw body from the request stream
    try {
      const raw = await getRawBody();
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch (e) {
          const params = new URLSearchParams(raw);
          if (params.has("to")) return Object.fromEntries(params.entries());
        }
      }
    } catch (e) {
      // ignore
    }

    // last resort: query param
    try {
      const url = event.node.req.url || "";
      const parsed = new URL(url, "http://localhost");
      if (parsed.searchParams.has("to")) return { to: parsed.searchParams.get("to") };
    } catch (e) {
      // ignore
    }

    throw new Error("Invalid JSON body");
  };

  try {
    const body = await parseBody();
    const { to } = body || {};

    if (!to) {
      setResponseStatus(event, 400);
      return { success: false, message: "'to' field is required" };
    }

    // generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    console.log("sending message to:", to);
    console.log("otp contents:", otp);

    // store or update OTP in the database
    await prisma.oTP.upsert({
      where: { email: to },
      update: { code: otp },
      create: { email: to, code: otp },
    });

    // ensure SMTP credentials are present
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_APP_PASSWORD;
    if (!user || !pass) {
      console.error('SMTP credentials are missing. Set SMTP_USER and SMTP_APP_PASSWORD.');
      setResponseStatus(event, 500);
      return { success: false, message: 'SMTP credentials not configured on server.' };
    }

      const mailerDebug = (process.env.NUXT_MAILER_DEBUG || '').toLowerCase() === 'true';
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: { user, pass },
        // Enable verbose logging only when explicitly turned on via NUXT_MAILER_DEBUG=true
        logger: mailerDebug,
        debug: mailerDebug,
      });

    await transporter.sendMail({
      from: `"Reading Huddle Team" <${user}>`,
      to,
      subject: "Your OTP for Reading Huddle",
      text: `Your OTP is: ${otp}`,
      html: `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #003366; text-align: center; padding: 20px;">
          <h1 style="color: white; font-size: 24px; margin: 0;">Welcome to Reading Huddle!</h1>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; margin-bottom: 10px;">Hi there,</p>
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            We received your request to log in or sign up. Here's your one-time password (OTP):
          </p>
          <div style="font-size: 24px; font-weight: bold; color: goldenrod; text-align: center; margin: 30px 0;">${otp}</div>
          <p style="font-size: 14px; color: #555; margin-bottom: 30px;">This OTP is only valid for one use. Please don’t share it with anyone.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 20px;">
          <p style="font-size: 12px; color: #888; text-align: center;">If you didn’t request this, please ignore this email.</p>
        </div>
      </div>
      `,
    });

    return { success: true, message: "OTP sent" };
  } catch (err) {
    console.error("Mailer error:", err);
    // If it's a client-side parsing issue, return 400; otherwise 500
    if (err && err.message && err.message.includes("Invalid JSON")) {
      setResponseStatus(event, 400);
      return { success: false, message: "Invalid JSON body" };
    }
    setResponseStatus(event, 500);
    return { success: false, message: "Server error: " + (err && err.message ? err.message : String(err)) };
  }
});
