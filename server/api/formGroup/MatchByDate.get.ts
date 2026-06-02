import { prisma } from '../../utils/prisma' 
import { Prisma } from '~~/prisma/generated/client'
import { getQuery, createError } from 'h3'
import { requireAdmin, requireSession } from '../../utils/require-session'  
import z from 'zod'

export default defineEventHandler(async (event) => {
  //session check needed
  const query = getQuery(event)
  const date = z.coerce.date().safeParse(query.date).data

  if (!date) {
    throw createError({
      statusCode: 400,
      message: 'Invalid or Missing Date',
    })
  }

  return await prisma.formGroup.findFirst({
    where: {
      startDate: { lte: date },
      OR: [
        { endDate: null },
        { endDate: { gte: date } },
      ],
    },
    orderBy: [{ startDate: 'desc' }, { id: 'desc' }],
    select: { id: true, startDate: true, endDate: true },
  })

})