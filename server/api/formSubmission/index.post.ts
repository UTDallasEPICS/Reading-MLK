import { Prisma } from '~~/prisma/generated/client'
import { prisma } from '../../utils/prisma'
import { getQuery } from 'h3'
import { z } from 'zod'
import { formSubmissionCreateSchema } from '../../utils/schemas'


export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const query = getQuery(event)

  const body = formSubmissionCreateSchema.safeParse(await readBody(event))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid form submission data'
    })
  }

  return await prisma.formSubmission.create({
    data: {
      form: body.data.form,
      student: body.data.student,
      Responses: {
        create: body.data.Responses.map((response) => ({
          formComponent: response.formComponent,
          response: response.response
        }))
      }
    }
  })

})