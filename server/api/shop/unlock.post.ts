import { auth } from '../../utils/auth'
import { prisma } from '../../utils/prisma'
import { z } from 'zod'

const unlockSchema = z.object({
  studentId: z.number().int().positive(),
  shopItemId: z.number().int().positive(),
})

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers })

  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const parsed = unlockSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.message })
  }

  const { studentId, shopItemId } = parsed.data

  const student = await prisma.student.findFirst({
    where: { id: studentId, parentUserId: session.user.id },
    select: { id: true, exp: true },
  })

  if (!student) {
    throw createError({ statusCode: 404, statusMessage: 'Student not found' })
  }

  const item = await prisma.shopItem.findUnique({
    where: { id: shopItemId },
    select: { id: true, cost: true },
  })

  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Shop item not found' })
  }

  const existing = await prisma.studentShopItem.findUnique({
    where: {
      studentId_shopItemId: { studentId, shopItemId },
    },
  })

  if (existing) {
    return { success: true, alreadyOwned: true, unlockedAt: existing.unlockedAt }
  }

  if (student.exp < item.cost) {
    throw createError({ statusCode: 400, statusMessage: 'Not enough XP' })
  }

  const [unlock] = await prisma.$transaction([
  prisma.studentShopItem.create({
    data: { studentId, shopItemId },
  }),
  prisma.student.update({
    where: { id: studentId },
    data: { exp: { decrement: item.cost } },
  }),
  ])

  return { success: true, alreadyOwned: false, unlockedAt: unlock.unlockedAt }
})