import { Prisma } from '~~/prisma/generated/client'
import { prisma } from '../../utils/prisma'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const query = getQuery(event)
  const now = new Date()


  //Get /api/formGroup?active=true to get only active form groups
  if (method === 'GET') {
    return await prisma.formGroup.findMany({
      where: query.active === 'true' ? {
        startDate: { lte: now },
        OR: [
          { endDate: null },
          { endDate: { gte: now } } ]
      } : {}
    })
  }

})