import { prisma } from '../../utils/prisma'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { email, name } = body

  if (!email || typeof email !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email is required',
    })
  }

  if (!name || typeof name !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name is required',
    })
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'User already exists',
    })
  }

  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      email,
      name,
      role: 'reader',
      emailVerified: false,
    },
  })

  return {
    success: true,
    user,
  }
})