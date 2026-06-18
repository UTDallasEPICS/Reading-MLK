import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'
import { magicLink } from 'better-auth/plugins'
import { mailer, fromAddress } from './email'

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
        await mailer.sendMail({
          from: fromAddress(),
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