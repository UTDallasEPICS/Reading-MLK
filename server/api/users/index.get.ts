import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/require-session'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
    },
  })

  return users
})
