import { prisma } from '../../utils/prisma'
import { getQuery, createError } from 'h3'
import { requireClassAccess, requireSession } from '../../utils/require-session'

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
      await requireSession(event)
    }

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
        include: {
          RaffleWinner: {
            include: {
              Parent: true
            }
          }
        }
      })
    }
    
    return await prisma.formGroup.findMany({
      where: {
        ...(classId ? { class: classId } : {}),
        ...(query.active === 'true'
          ? {
              startDate: { lte: now },
              OR: [{ endDate: null }, { endDate: { gte: now } }],
            }
          : {}),
      },
    })
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const requestedClassId = typeof body?.classId === 'string' ? body.classId : ''

    if (!requestedClassId) {
      throw createError({ statusCode: 400, statusMessage: 'classId is required' })
    }

    const { classId } = await requireClassAccess(event, requestedClassId)

    if (!body.id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Form group ID is required',
      })
    }

    const formGroup = await prisma.formGroup.findFirst({
      where: { id: Number(body.id), class: classId },
      select: { id: true },
    })

    if (!formGroup) {
      throw createError({ statusCode: 404, statusMessage: 'Form group not found in this class' })
    }

    if (body.raffleWinner !== null) {
      const studentInClass = await prisma.student.findFirst({
        where: {
          id: Number(body.raffleWinner),
          Classes: { some: { id: classId } },
        },
        select: { id: true },
      })

      if (!studentInClass) {
        throw createError({ statusCode: 400, statusMessage: 'Raffle winner is not in this class' })
      }
    }

    return await prisma.formGroup.update({
      where: { id: formGroup.id },
      data: {
        raffleWinner: body.raffleWinner === null
          ? null
          : Number(body.raffleWinner),
      },
    })
  }
})
