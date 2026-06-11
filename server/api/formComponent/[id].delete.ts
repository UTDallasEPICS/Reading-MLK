import { prisma } from '../../utils/prisma' 
import { Prisma } from '~~/prisma/generated/client'
import { getQuery, createError } from 'h3'
import { requireAdmin, requireSession } from '../../utils/require-session'  
import z from 'zod'


export default defineEventHandler(async (event) => {
  //require admin

  const idParam = getRouterParam(event, 'id')

  if (!idParam) {
    throw createError({
      statusCode: 400,
      message: "Missing ID Parameter"
    })
  }

  const id = z.coerce.number().safeParse(idParam)

  if (!id.success) {
    throw createError({
      statusCode:400,
      message: id.error.message
    })
  }

  await prisma.formComponent.delete({
    where: { id: id.data }
  })

  return {
    success: true,
    message: 'Form Component Deleted'
  }
})