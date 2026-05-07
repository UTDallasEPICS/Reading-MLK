import { prisma } from '../../utils/prisma'
import { auth } from '../../utils/auth'
import { emailSchema } from '~~/server/utils/schemas'
import nodemailer from 'nodemailer'
import crypto from 'node:crypto'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const newEmail = emailSchema.safeParse(await readBody(event))

  if (!newEmail.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email',
    })
  }
  if (newEmail.data === session.user.email?.trim().toLowerCase()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'That is already your current email',
    })
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: newEmail.data },
    select: { id: true },
  })

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Email already in use',
    })
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

  await prisma.pendingEmailChange.create({
    data: {
      userId: session.user.id,
      newEmail: newEmail.data,
      token,
      expiresAt,
    },
  })

  const confirmUrl = `${process.env.BETTER_AUTH_URL}/api/users/confirm-email-change?token=${token}`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER,
    to: newEmail.data,
    subject: 'Confirm your new Reading Huddle email',
    html: `
      <p>You requested to change the email on your Reading Huddle account.</p>
      <p>Click the link below to confirm your new email address:</p>
      <p><a href="${confirmUrl}">Confirm Email Change</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this change, you can ignore this email.</p>
    `,
  })

  return {
    success: true,
    message: 'Confirmation email sent to your new address',
  }
})