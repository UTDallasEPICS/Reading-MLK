import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/require-session'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  
  if (method === 'DELETE') {
    await requireAdmin(event)

    const id = event.context.params?.id

    if (!id) {
      setResponseStatus(event, 400)
      return { error: 'Missing announcement ID' }
    }

    const numericId = parseInt(id, 10)

    if (isNaN(numericId)) {
      setResponseStatus(event, 400)
      return { error: 'Invalid announcement ID — must be a whole number' }
    }

    try {
      await prisma.announcement.delete({ where: { id: numericId } })
      return { success: true }
    } catch (e: any) {
      if (e?.code === 'P2025') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Announcement not found',
        })
      }

      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete announcement',
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method Not Allowed',
  })
})
