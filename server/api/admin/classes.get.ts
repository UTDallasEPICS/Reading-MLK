import { prisma } from '../../utils/prisma'
import { requireCoach } from '../../utils/require-session'

export default defineEventHandler(async (event) => {
  const session = await requireCoach(event)

  return await prisma.class.findMany({
    where: {
      Coach: {
        some: {
          userId: session.user.id,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
    select: {
      joinToken: true,
      name: true,
    },
  })
})
