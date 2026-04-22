import { Prisma } from '~~/prisma/generated/client'
import { prisma } from '../../utils/prisma'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const query = getQuery(event)
  const now = new Date()


  //Get /api/formGroup?active=true to get only active form groups
  if (method === 'GET') {
    if (query.date) {
      const targetDate = new Date(String(query.date))
      return await prisma.formGroup.findFirst({
        where: {
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
      where: query.active === 'true' ? {
        startDate: { lte: now },
        OR: [
          { endDate: null },
          { endDate: { gte: now } } ]
      } : {}
    })
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    if (body.id) {
      return await prisma.formGroup.update({
        where: { id: Number(body.id) },
        data: { raffleWinner: body.raffleWinner === null ? null : Number(body.raffleWinner) }
      })
    }
  }

})