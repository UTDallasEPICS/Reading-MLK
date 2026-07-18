import { prisma } from '../../utils/prisma'
import { requireClassManager } from '../../utils/require-session'

export default defineEventHandler(async (event) => {
  const session = await requireClassManager(event)

  return await prisma.class.findMany({
    where:
      session.user.role === 'admin'
        ? undefined
        : {
            Posters: {
              some: {
                userId: session.user.id,
              },
            },
          },
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
    },
  })
})
