import { prisma } from '../../utils/prisma' 
import { Prisma } from '~~/prisma/generated/client'
import { getQuery, createError } from 'h3'
import { z } from 'zod'
import { requireAdmin, requireSession } from '../../utils/require-session'  
import { formComponentUpdateSchema } from '../../utils/schemas'

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
  const component = formComponentUpdateSchema.safeParse(body)
  
  if (!component.success) {throw createError({ statusCode: 400, message: component.error.message })}
  
  const id = z.coerce.number().safeParse(idParam)
  
  if (!id.success) {throw createError({ statusCode: 400, message: 'Invalid ID Parameter'})}
    
  const formExists = await prisma.form.findUnique({
    where: {id: component.data.form}
  }).then(Boolean)

  if (!formExists) {
    throw createError({
      statusCode: 404,
      message: "Form Not Found"
    })
  }
  const updated = await prisma.formComponent.update({
    where: {id: id.data},
    data: component.data as Prisma.FormComponentUncheckedUpdateInput
  })

  return {
    success: true,
    message: 'Form Component Updated',
    data: updated
  }
})