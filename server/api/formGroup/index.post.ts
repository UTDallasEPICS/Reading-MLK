import { prisma } from '../../utils/prisma' 
import { Prisma } from '~~/prisma/generated/client'
import { getQuery, createError } from 'h3'
import { requireAdmin, requireSession } from '../../utils/require-session'  
import { formGroupInclude } from '../../utils/prismaInclusions'
import { formGroupCreateSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  //require admin
  const body = await readBody(event)
  if (!body) {
    throw createError({
      statusCode: 400,
      message: "Missing Request Body"
    })
  }

  const formGroup = formGroupCreateSchema.safeParse(body)

  if (!formGroup.success) {
    throw createError({
      statusCode: 400,
      message: formGroup.error.message
    })
  }
  
  const created = await prisma.formGroup.create({
    data: formGroup.data as Prisma.FormGroupUncheckedCreateInput,
    include: formGroupInclude,
  })

  return {
    success: true,
    message: 'Form group create',
    data: {
      id: created.id,
      startDate: created.startDate,
      endDate: created.endDate, 
      raffleWinner: null,
      raffleWinnerStudent: null,
      forms: created.Forms
    }
  }

})