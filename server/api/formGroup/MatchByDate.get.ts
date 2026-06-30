import { prisma } from '../../utils/prisma' 
import { Prisma } from '~~/prisma/generated/client'
import { getQuery, createError } from 'h3'
import { requireAdmin, requireSession } from '../../utils/require-session'  
import z from 'zod'

export default defineEventHandler(async (event) => {
  //session check needed
  const query = getQuery(event)
  
  if (!query.date) {
    throw createError({
      statusCode: 400,
      message: 'Missing Date',
    })
  }

  const date = z.coerce.date().safeParse(query.date)

  if (!date.success) {
    throw createError({
      statusCode: 400,
      message: date.error.message
    })
  }

  return await prisma.formGroup.findFirst({
    where: {
      startDate: { lte: date.data },
      OR: [
        { endDate: null },
        { endDate: { gte: date.data } },
      ],
    },
    orderBy: [{ startDate: 'desc' }, { id: 'desc' }],
    select: { id: true, startDate: true, endDate: true }
  })
})