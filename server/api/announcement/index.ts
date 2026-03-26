import { Prisma } from '~~/prisma/generated/client'
import { prisma } from '../../utils/prisma'
import { getQuery } from 'h3'
import { lte } from 'zod'
import { _isoDateTime } from 'better-auth'

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
    const body = await readBody(event)
    return await prisma.announcement.create({
      data: {
        content: body.content,
        postDate: new Date(body.postDate),
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
        author: body.author,
      }
    })
  }
})