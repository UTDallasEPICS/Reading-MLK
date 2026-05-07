import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.email || typeof body.email !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email is required',
    })
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  })

  return {
    exists: !!user,
    user,
  }
})