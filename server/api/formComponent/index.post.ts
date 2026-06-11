import { prisma } from '../../utils/prisma' 
import { Prisma } from '~~/prisma/generated/client'
import { getQuery, createError } from 'h3'
import { requireAdmin, requireSession } from '../../utils/require-session'  
import { formInclude } from '../../utils/prismaInclusions'
import { formComponentCreateSchema } from '../../utils/schemas'


export default defineEventHandler(async (event) => {
  //require admin

  const body = await readBody(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      message: "Missing Request Body"
    })
  }

  const component = formComponentCreateSchema.safeParse(body)

  if (!component.success) {
    throw createError({
      statusCode:400,
      message: component.error.message
    })
  }

  const formExists = await prisma.form.findUnique({
    where: { id: component.data.form}
  }).then(Boolean)

  if (!formExists) {
    throw createError({
      statusCode: 404,
      message: "Form Not Found"
    })
  }

  const existingMax = await prisma.formComponent.aggregate({
    where: { form: component.data.form },
    _max: { order: true },
  })

  component.data.order = component.data.order ?? ((existingMax._max.order ?? -1) + 1)

  const created = await prisma.formComponent.create({
    data: component.data as Prisma.FormComponentUncheckedCreateInput
  })

  setResponseStatus(event, 201)

  return {
    success: true,
    message: 'Form component created',
    data: created
  }
})