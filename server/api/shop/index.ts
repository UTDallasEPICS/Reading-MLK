import { auth } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers })

  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const studentIdRaw = getQuery(event).studentId
  const studentId = Number(studentIdRaw)

  if (!studentIdRaw || Number.isNaN(studentId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid studentId' })
  }

  const student = await prisma.student.findFirst({
    where: { id: studentId, parentUserId: session.user.id },
    select: { id: true },
  })

  if (!student) {
    throw createError({ statusCode: 404, statusMessage: 'Student not found' })
  }

  const shopItems = await prisma.shopItem.findMany({
    include: {
      Theme: true,
      Animation: true,
      StudentUnlocks: {
        where: { studentId },
        select: { unlockedAt: true },
      },
    },
    orderBy: { id: 'asc' },
  })

  return shopItems.map((item) => ({
    id: item.id,
    type: item.type,
    name: item.name,
    cost: item.cost,
    dateAvailable: item.dateAvailable,
    owned: item.StudentUnlocks.length > 0,
    unlockedAt: item.StudentUnlocks[0]?.unlockedAt ?? null,
    themeColor: item.Theme?.themeColor ?? null,
    themeEffect: item.Theme?.themeEffect ?? null,
    animationType: item.Animation?.animationType ?? null,
    animationEffect: item.Animation?.animationEffect ?? null,
  }))
})