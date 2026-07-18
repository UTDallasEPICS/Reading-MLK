import { prisma } from '../../utils/prisma'
import { requireClassAccess } from '../../utils/require-session'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'DELETE') {
    const query = getQuery(event)
    const classId = typeof query.classId === 'string' ? query.classId : ''

    if (!classId) {
      throw createError({ statusCode: 400, statusMessage: 'classId is required' })
    }

    await requireClassAccess(event, classId)

    const id = event.context.params?.id

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Missing announcement ID' })
    }

    const numericId = parseInt(id, 10)

    if (isNaN(numericId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid announcement ID — must be a whole number' })
    }

    try {
      const announcement = await prisma.announcement.findFirst({
        where: { id: numericId, class: classId },
        select: { id: true },
      })

      if (!announcement) {
        throw createError({ statusCode: 404, statusMessage: 'Announcement not found in this class' })
      }

      await prisma.announcement.delete({ where: { id: announcement.id } })
      return { success: true }
    } catch (e: any) {
      if (e?.statusCode) {
        throw e
      }

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
