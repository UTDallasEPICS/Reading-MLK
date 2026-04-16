import { prisma } from '../../../utils/prisma'
import { auth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id || Number.isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID',
    })
  }

  const studentId = Number(id)

  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const student = await prisma.student.findFirst({
    where: {
      id: studentId,
      parentUserId: session.user.id,
    },
    select: {
      id: true,
    },
  })

  if (!student) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Student not found',
    })
  }

  const shopItems = await prisma.shopItem.findMany({
    orderBy: [{ dateAvailable: 'asc' }, { id: 'asc' }],
    include: {
      Theme: true,
      Animation: true,
      unlockedByStudents: {
        where: { studentId },
        select: { id: true },
      },
    },
  })

  return shopItems.map((item) => ({
    id: item.id,
    type: item.type,
    name: item.name,
    dateAvailable: item.dateAvailable.toISOString(),
    cost: item.cost,
    owned: item.cost === 0 || item.unlockedByStudents.length > 0,
    themeColor: item.Theme?.themeColor ?? null,
    themeEffect: item.Theme?.themeEffect ?? null,
    animationType: item.Animation?.animationType ?? null,
    animationEffect: item.Animation?.animationEffect ?? null,
  }))
})
