import { prisma } from '../../../utils/prisma'
import { requireSession } from '../../../utils/require-session'
import { changeShopItem, ownedCatalogIds, ShopError } from '../../../utils/reader-shop'
import { z } from 'zod'

export default defineEventHandler(async event => {
  const session = await requireSession(event)
  const id = Number(event.context.params?.id)
  if (!Number.isSafeInteger(id) || id <= 0) throw createError({ statusCode: 400, statusMessage: 'Invalid student' })
  const student = await prisma.student.findFirst({ where: { id, parentUserId: session.user.id }, include: { unlockedShopItems: true } })
  if (!student) throw createError({ statusCode: 404, statusMessage: 'Student not found' })
  if (event.method === 'GET') return ownedCatalogIds(student.unlockedShopItems)
  if (event.method !== 'POST') throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  const body = z.object({ itemId: z.int(), action: z.enum(['buy', 'equip']) }).safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Invalid shop request' })
  try {
    return await changeShopItem(prisma, id, body.data.itemId, body.data.action)
  } catch (error) {
    if (error instanceof ShopError) throw createError({ statusCode: error.statusCode, statusMessage: error.message })
    throw error
  }
})
