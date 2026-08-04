import { prisma } from '~~/server/utils/prisma'
import { requireClassAccess } from '~~/server/utils/require-session'
import { formUpdateSchema } from '~~/server/utils/schemas'
import { z } from 'zod'

export default eventHandler(async (event) => {
  const query = getQuery(event)
  const classToken = typeof query.classId === 'string' ? query.classId : ''

  if (!classToken) {
    throw createError({ statusCode: 400, statusMessage: 'classId is required' })
  }

  const { classId } = await requireClassAccess(event, classToken)
  const body = formUpdateSchema.safeParse(await readBody(event))

  if (!body.success) {throw createError({ statusCode: 400, message: body.error.message })}
  const id = z.coerce.number().safeParse(event.context.params?.id)

  if (!id.success || !id.data) {throw createError({ statusCode: 400, message: 'Missing or Invalid form ID'})}

  const form = await prisma.form.findFirst({
    where: { id: id.data, FormGroup: { class: classId } },
    select: { id: true },
  })

  if (!form) {
    throw createError({ statusCode: 404, statusMessage: 'Form not found in this class' })
  }

  return await prisma.form.update({
    where: { id: form.id },
    data: body.data
  })
 })
