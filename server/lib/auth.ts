import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";

import { sendEmail } from './sendEmail';

const client = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(client, {
    provider: "sqlite",
  }),
  
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  
  trustedOrigins: ["http://localhost:3000"],
  
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({email, url}) => {
        console.log('Sending magic link to:', email);
        console.log('Magic link URL:', url);
        await sendEmail({
          to: email,
          subject: "Your Magic Login Link - Reading Huddle",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2d3748;">Welcome to Reading Huddle!</h2>
              <p>Click the button below to sign in to your account:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" style="background-color: #2d3748; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Sign In Now
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
              <p style="color: #2d3748; word-break: break-all; font-size: 12px;">${url}</p>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">This link will expire in 5 minutes and can only be used once.</p>
            </div>
          `,
        })
      },
    }),
  ],
});