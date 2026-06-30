import { prisma } from '../../utils/prisma' 
import { Prisma } from '~~/prisma/generated/client'
import { getQuery, createError } from 'h3'
import { z } from 'zod'
import { requireAdmin, requireSession } from '../../utils/require-session'  
import { formGroupInclude } from '../../utils/prismaInclusions'
import { formGroupUpdateSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  //require admin
  const idParam = getRouterParam(event, 'id')
  if (!idParam) {
    throw createError({
      statusCode: 400,
      message: "Missing ID"
    })
  }

  const body = await readBody(event)
  const group = formGroupUpdateSchema.safeParse(body)
  
  if (!group.success) {throw createError({ statusCode: 400, message: group.error.message })}
  
  const id = z.coerce.number().safeParse(idParam)
  
  if (!id.success) {throw createError({ statusCode: 400, message: 'Invalid ID Parameter'})}
    
  const updated = await prisma.formGroup.update({
    where: {id: id.data},
    data: group.data as Prisma.FormGroupUncheckedUpdateInput,
    include: formGroupInclude
  })

  return {
    success: true,
    message: 'FormGroup Updated',
    data: updated
  }
})