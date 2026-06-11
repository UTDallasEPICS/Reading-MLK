import { prisma } from '../../utils/prisma' 
import { Prisma } from '~~/prisma/generated/client'
import { getQuery, createError } from 'h3'
import { requireAdmin, requireSession } from '../../utils/require-session'  
import { formInclude } from '../../utils/prismaInclusions'
import { formCreateSchema } from '../../utils/schemas'

export default defineEventHandler (async (event) => {

  //require admin
  const body = await readBody(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      message: "Missing Request Body"
    })
  }

  const form = formCreateSchema.safeParse(body)

  if (!form.success) {
    throw createError({
      statusCode: 400,
      message: form.error.message
    })
  }

  const requestedGroupExists = await prisma.formGroup.findUnique({
    where: {id: form.data.formGroup}, }).then(Boolean)

  if (!requestedGroupExists) {
    throw createError({
      statusCode: 404,
      message: "FormGroup Not Found"
    })
  }

  const existingMax = await prisma.form.aggregate({
    where: { formGroup: form.data.formGroup },
    _max: { order: true },
  })

  form.data.order = ((existingMax._max.order ?? -1) + 1)

  const created = await prisma.form.create({
    data: form.data as Prisma.FormUncheckedCreateInput,
    include: formInclude
  })

  return {
    success: true,
    message: 'Form Created',
    data: created
  }

})