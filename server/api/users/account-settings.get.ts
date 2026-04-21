import { prisma } from '../../utils/prisma'
import { auth } from '../../utils/auth'

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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      raffleOptIn: true,
      publicityConsent: true,
    },
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    })
  }

  return user
})