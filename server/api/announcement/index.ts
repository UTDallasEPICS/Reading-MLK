import { prisma } from '../../utils/prisma'
import { getQuery } from 'h3'
import { z } from 'zod'
import { announcementCreateSchema } from '../../utils/schemas'

// GET /api/announcement?active=true to get only active announcements
export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const query = getQuery(event)
  const now = new Date()

  if (method === 'GET') {
    return await prisma.announcement.findMany({
      where: query.active === 'true' ? {
        postDate: { lte: now },
        OR: [
          { expiryDate: null },
          { expiryDate: { gte: now } }
        ]
      } : {}
    })
  }

  if (method === 'POST') {
    const body = announcementCreateSchema.safeParse(await readBody(event))
    
    if (!body.success) {
      throw createError({ statusCode: 400, message: body.error.message })
    }

    return await prisma.announcement.create({
      data: {
        content: body.data.content,
        postDate: new Date(body.data.postDate),
        expiryDate: body.data.expiryDate ? new Date(body.data.expiryDate) : null,
        author: body.data.author,
      }
    })
  }
})
