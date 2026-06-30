import { prisma } from '../../utils/prisma' 
import { Prisma } from '~~/prisma/generated/client'
import { getQuery, createError } from 'h3'
import { requireAdmin, requireSession } from '../../utils/require-session'  
import z from 'zod'
import dayjs from 'dayjs'
import { formGroupInclude } from '../../utils/prismaInclusions'

export default defineEventHandler(async (event) => {
  //add auth
  const idParam = getRouterParam(event, 'id')

  if (!idParam) {
    throw createError({
      statusCode: 400,
      message: "Missing FormGroup id"
    })
  }
  const groupId = z.coerce.number().safeParse(idParam)

  if (!groupId.success) {
    throw createError({
      statusCode: 400,
      message: groupId.error.message
    })
  }

  const group = await prisma.formGroup.findUnique({
    where: { id: groupId.data as number },
    include: formGroupInclude,
  })

  if (!group) {
    throw createError({ statusCode: 404, statusMessage: 'Form group not found' })
  }

  return {
    id: group.id,
    startDate: dayjs(group.startDate).toISOString(),
    endDate: dayjs(group.endDate).toISOString(),
    raffleWinner: group.raffleWinner,
    raffleWinnerStudent: group.RaffleWinner,
    forms: group.Forms,
  }
})