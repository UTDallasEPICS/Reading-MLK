import { prisma } from '../../utils/prisma'
import { getQuery, createError } from 'h3'
import { requireClassAccess } from '../../utils/require-session'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const query = getQuery(event)
  const now = new Date()
  const classToken = typeof query.classId === 'string' ? query.classId : null


  //Get /api/formGroup?active=true to get only active form groups
  if (method === 'GET') {
    let classId: string | null = null

    if (classToken) {
      classId = (await requireClassAccess(event, classToken)).classId
    } else {
      throw createError({ statusCode: 403, statusMessage: 'Class access is required' })
    }

    const activeWhere = query.active === 'true'
      ? {
          startDate: { lte: now },
          OR: [{ endDate: null }, { endDate: { gte: now } }],
        }
      : {}

    if (query.date) {
      const targetDate = new Date(String(query.date))
      return await prisma.formGroup.findFirst({
        where: {
          ...(classId ? { class: classId } : {}),
          startDate: { lte: targetDate },
          OR: [
            { endDate: null },
            { endDate: { gte: targetDate } }
          ]
        },

      })
    }
    
    return await prisma.formGroup.findMany({
      where: {
        ...activeWhere,
        ...(classId ? { class: classId } : {}),
      },
    })
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
