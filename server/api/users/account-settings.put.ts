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

  const body = await readBody(event)

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      raffleOptIn:
        typeof body.raffleOptIn === 'boolean' ? body.raffleOptIn : undefined,
      publicityConsent:
        typeof body.publicityConsent === 'boolean' ? body.publicityConsent : undefined,
    },
    select: {
      raffleOptIn: true,
      publicityConsent: true,
    },
  })

  return {
    success: true,
    settings: updatedUser,
  }
})