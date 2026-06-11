import { Prisma } from '~~/prisma/generated/client'
import { auth } from '~~/server/utils/auth'
import { prisma } from '~~/server/utils/prisma'
import { getQuery, setResponseStatus, type H3Event } from 'h3'
import { formUpdateSchema } from '~~/server/utils/schemas'
import { z } from 'zod'

export default eventHandler(async (event) => {

  //require sessions
  const idParam = getRouterParam(event, 'id')
  if (!idParam) {
    throw createError({
      statusCode: 400,
      message: "Missing ID"
    })
  }

  const body = formUpdateSchema.safeParse(await readBody(event))

  if (!body.success) {throw createError({ statusCode: 400, message: body.error.message })}

  const id = z.coerce.number().safeParse(idParam)

  if (!id.success) {throw createError({ statusCode: 400, message: 'Invalid form ID'})}
  
  return await prisma.form.update({
    where: { id: id.data },
    data: body.data
  })
 })