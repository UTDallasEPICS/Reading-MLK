import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'
import { magicLink } from 'better-auth/plugins'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite',
  }),

  baseURL: process.env.BETTER_AUTH_URL,

  user: {
    additionalFields: {
      role: {
        type: 'string',
        input: false,
        defaultValue: 'reader',
      },
    },
  },

  plugins: [
    magicLink({
      async sendMagicLink({ email, url }) {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER,
          to: email,
          subject: 'Sign in to Reading Huddle',
          html: `
            <p>Click the link below to sign in to Reading Huddle:</p>
            <p><a href="${url}">Sign in</a></p>
          `,
        })
      },
    }),
  ],
})