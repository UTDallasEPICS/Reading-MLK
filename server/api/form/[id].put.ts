import { Prisma } from '~~/prisma/generated/client'
import { auth } from '~~/server/utils/auth'
import { prisma } from '~~/server/utils/prisma'
import { getQuery, setResponseStatus, type H3Event } from 'h3'
import { formUpdateSchema } from '~~/server/utils/schemas'
import { z } from 'zod'

export default eventHandler(async (event) => {

  //require sessions
  const body = formUpdateSchema.safeParse(await readBody(event))

  if (!body.success) {throw createError({ statusCode: 400, message: body.error.message })}

  const id = z.coerce.number().safeParse(event.context.params?.id)

  if (!id.success || !id.data) {throw createError({ statusCode: 400, message: 'Missing or Invalid form ID'})}
  
  return await prisma.form.update({
    where: { id: id.data },
    data: body.data
  })
 })