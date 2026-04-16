import { prisma } from '../../../utils/prisma'
import { auth } from '../../../utils/auth'
import { setResponseStatus } from 'h3'

const toInt = (value: unknown) => {
  if (Array.isArray(value)) {
    value = value[0]
  }

  if (value === undefined || value === null || value === '') {
    return null
  }

  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isInteger(parsed) ? parsed : null
}

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
      exp: true,
    },
  })

  if (!student) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Student not found',
    })
  }

  const body = await readBody(event)
  const shopItemId = toInt(body?.shopItemId ?? body?.id)

  if (shopItemId === null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'shopItemId is required',
    })
  }

  const shopItem = await prisma.shopItem.findUnique({
    where: { id: shopItemId },
    include: {
      Theme: true,
      Animation: true,
    },
  })

  if (!shopItem) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Shop item not found',
    })
  }

  if (shopItem.dateAvailable > new Date()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Shop item is not available yet',
    })
  }

  const alreadyUnlocked = await prisma.studentShopItem.findUnique({
    where: {
      studentId_shopItemId: {
        studentId,
        shopItemId,
      },
    },
  })

  if (alreadyUnlocked) {
    return {
      created: false,
      message: 'Shop item already unlocked',
      item: {
        id: shopItem.id,
        type: shopItem.type,
        name: shopItem.name,
        cost: shopItem.cost,
      },
    }
  }

  if ((student.exp ?? 0) < shopItem.cost) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Not enough XP',
    })
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedStudent = await tx.student.update({
      where: { id: studentId },
      data: {
        exp: { decrement: shopItem.cost },
      },
      select: { exp: true },
    })

    const unlock = await tx.studentShopItem.create({
      data: {
        studentId,
        shopItemId,
      },
    })

    return { updatedStudent, unlock }
  })

  setResponseStatus(event, 201)

  return {
    created: true,
    message: 'Shop item unlocked',
    student: {
      id: studentId,
      exp: result.updatedStudent.exp,
    },
    unlock: result.unlock,
    item: {
      id: shopItem.id,
      type: shopItem.type,
      name: shopItem.name,
      cost: shopItem.cost,
      themeColor: shopItem.Theme?.themeColor ?? null,
      themeEffect: shopItem.Theme?.themeEffect ?? null,
      animationType: shopItem.Animation?.animationType ?? null,
      animationEffect: shopItem.Animation?.animationEffect ?? null,
    },
  }
})
