import { Prisma } from '~~/prisma/generated/client'
import { prisma } from '../../utils/prisma'
import { getQuery } from 'h3'
import { z } from 'zod'
import { formSubmissionCreateSchema } from '../../utils/schemas'
import { requireClassAccess, requireSession } from '../../utils/require-session'

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
    } else if (query.student) {
      const session = await requireSession(event)
      const studentId = Number(query.student)
      const student = await prisma.student.findFirst({
        where: { id: studentId, parentUserId: session.user.id },
        select: { id: true, Classes: { select: { id: true } } },
      })

      if (!student) {
        throw createError({ statusCode: 404, statusMessage: 'Student not found' })
      }

      where.student = student.id
    } else {
      throw createError({ statusCode: 400, statusMessage: 'classId or student is required' })
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
    const session = await requireSession(event)
    const body = formSubmissionCreateSchema.safeParse(await readBody(event))

    if (!body.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid form submission data'
      })
    }

    const student = await prisma.student.findFirst({
      where: { id: body.data.student, parentUserId: session.user.id },
      select: { id: true, Classes: { select: { id: true } } },
    })

    if (!student) {
      throw createError({ statusCode: 404, statusMessage: 'Student not found' })
    }

    if (
      body.data.classId &&
      body.data.classId !== 'all' &&
      !student.Classes.some((classroom) => classroom.id === body.data.classId)
    ) {
      throw createError({ statusCode: 403, statusMessage: 'Student is not in this class' })
    }

    const form = await prisma.form.findFirst({
      where: {
        id: body.data.form,
        published: true,
        ...(body.data.classId && body.data.classId !== 'all'
          ? { FormGroup: { class: body.data.classId } }
          : {}),
      },
      select: { id: true },
    })

    if (!form) {
      throw createError({ statusCode: 403, statusMessage: 'This form is not available to the student' })
    }

    return await prisma.formSubmission.create({
      data: {
        form: form.id,
        student: student.id
      }
    })
  }
})
