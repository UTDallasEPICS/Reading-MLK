import { prisma } from '../../utils/prisma'
import { getQuery, createError } from 'h3'
import { requireAdmin } from '../../utils/require-session'

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

    const session = await requireAdmin(event)

    const admin = await prisma.admin.findUnique({
      where: { userId: session.user.id },
    })

    if (!admin) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
      })
    }

    const body = await readBody(event)

    // SQLite has no native JSON type — Prisma's generated client for SQLite
    // types `Json?` columns as String and expects a pre-serialised string.
    // We stringify here so the value is always stored as a valid JSON string,
    // whether the client sent a plain object (new code) or a string (legacy).
    const contentStr = body.content == null
      ? null
      : typeof body.content === 'string'
        ? body.content
        : JSON.stringify(body.content)

    return await prisma.announcement.create({
      data: {
        content: contentStr,
        postDate: new Date(body.postDate),
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
        author: admin.id,
      }
    })
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method Not Allowed',
  })
})
