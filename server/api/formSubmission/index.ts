import { Prisma } from '~~/prisma/generated/client'
import { prisma } from '../../utils/prisma'
import { getQuery } from 'h3'
import { z } from 'zod'
import { formSubmissionCreateSchema } from '../../utils/schemas'
import { requireClassAccess } from '../../utils/require-session'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const query = getQuery(event)

  if (method === 'GET') {
    const where: Prisma.FormSubmissionWhereInput = {}
    const classToken = typeof query.classId === 'string' ? query.classId : null

    if (classToken) {
      const { classId } = await requireClassAccess(event, classToken)
      where.Form = { FormGroup: { class: classId } }
      where.Student = { Classes: { some: { id: classId } } }
    }
    
    if (query.form) {
      where.form = Number(query.form)
    }
    if (query.student) {
      where.student = Number(query.student)
    }
    if (query.formGroup) {
      where.Form = {
        ...where.Form,
        formGroup: Number(query.formGroup),
      }
    }

    return await prisma.formSubmission.findMany({
      where
    })
  }

  if (method === 'POST') {
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
        student: body.data.student
      }
    })
  }
})
