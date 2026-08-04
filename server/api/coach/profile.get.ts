import { prisma } from '../../utils/prisma'
import { requireCoach } from '../../utils/require-session'

export default defineEventHandler(async (event) => {
  const session = await requireCoach(event)

  return await prisma.coach.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      tag: true,
      verified: true,
      school: true,
      district: true,
      zipcode: true,
    },
  })
})
