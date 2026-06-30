import { prisma } from '../../utils/prisma' 
import { Prisma } from '~~/prisma/generated/client'
import { getQuery, createError } from 'h3'
import { requireAdmin, requireSession } from '../../utils/require-session'  
import z from 'zod'
import dayjs from 'dayjs'
import { formGroupInclude } from '../../utils/prismaInclusions'

export default defineEventHandler(async (event) => {
  //require admin

  const idParam = getRouterParam(event, 'id')

  if (!idParam) {
    throw createError({
      statusCode: 400,
      message: "Missing FormGroup id"
    })
  }

  const group = z.coerce.number().safeParse(idParam)
  
  if (!group.success) {
    throw createError({
      statusCode: 400,
      message: group.error.message
    })
  }

  await prisma.formGroup.delete({
    where: {id: group.data}
  })

  return {
    success: true,
    message: 'Form Group deleted',
  }

})