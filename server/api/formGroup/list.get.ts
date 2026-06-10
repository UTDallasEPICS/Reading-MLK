import { Prisma } from '~~/prisma/generated/client'
import { auth } from '~~/server/utils/auth'
import { prisma } from '~~/server/utils/prisma'
import { getQuery, setResponseStatus, type H3Event } from 'h3'
import {z } from 'zod'
import { formGroupInclude } from '../../utils/prismaInclusions'


export default eventHandler(async (event: H3Event) => {
  //add auth
  const groups = await prisma.formGroup.findMany({
    orderBy: [{ startDate: 'desc' }, { id: 'desc' }],
    include: formGroupInclude
  })

  return groups.map((group) => ({
        id: group.id,
        startDate: group.startDate,
        endDate: group.endDate,
        raffleWinner: group.raffleWinner,
        raffleWinnerStudent: group.RaffleWinner,
        forms: group.Forms,
      }))
})