import { prisma } from '../../utils/prisma'
import { getQuery, createError } from 'h3'
import { requireClassAccess, requireSession } from '../../utils/require-session'
import { announcementCreateSchema } from '../../utils/schemas'

// GET /api/announcement?active=true to get only active announcements
export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const query = getQuery(event)
  const now = new Date()
  const classId = typeof query.classId === 'string' ? query.classId : null

  if (method === 'GET') {
    if (classId) {
      await requireClassAccess(event, classId)
    } else {
      await requireSession(event)
    }

    const activeWhere = query.active === 'true'
      ? {
          postDate: { lte: now },
          OR: [{ expiryDate: null }, { expiryDate: { gte: now } }],
        }
      : {}
    
    return await prisma.announcement.findMany({
      where: {
        ...activeWhere,
        ...(classId ? { class: classId } : {}),
      },
      orderBy: { postDate: 'desc' },
    })
  }

  if (method === 'POST') {
    const rawBody = await readBody(event)
    const requestedClassId = typeof rawBody?.classId === 'string' ? rawBody.classId : ''

    if (!requestedClassId) {
      throw createError({ statusCode: 400, statusMessage: 'classId is required' })
    }

    const session = await requireClassAccess(event, requestedClassId)
    const body = announcementCreateSchema.safeParse(rawBody)
    
    if (!body.success) {
      throw createError({ statusCode: 400, message: body.error.message })
    }

    return await prisma.$transaction(async (transaction) => {
      const poster = await transaction.poster.upsert({
        where: { userId: session.user.id },
        update: {},
        create: { userId: session.user.id },
        select: { id: true },
      })

      return await transaction.announcement.create({
        data: {
          content: body.data.content,
          postDate: body.data.postDate,
          expiryDate: body.data.expiryDate ?? null,
          author: poster.id,
          class: requestedClassId,
        },
      })
    })
  }
})
