import { prisma } from '../../utils/prisma'
import { auth } from '../../utils/auth'
import { emailSchema } from '~~/server/utils/schemas'
import { mailer, fromAddress } from '../../utils/email'
import crypto from 'node:crypto'

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

  const body = await readBody(event)

  const newEmail = emailSchema.safeParse(body.email)

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

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

  const tokenPlain = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(tokenPlain).digest('hex')

  await prisma.pendingEmailChange.upsert({
    where: { userId: session.user.id },
    update: { newEmail: newEmail.data, token: tokenHash, expiresAt },
    create: { userId: session.user.id, newEmail: newEmail.data, token: tokenHash, expiresAt },
  })

  const confirmUrl = `${process.env.BETTER_AUTH_URL}/api/users/confirm-email-change?token=${tokenPlain}`

  await mailer.sendMail({
    from: fromAddress(),
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