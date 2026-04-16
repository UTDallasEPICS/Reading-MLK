import { Prisma } from '~~/prisma/generated/client'
import { prisma } from '../../utils/prisma'
import { getQuery, setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const query = getQuery(event)

  if (method === 'GET') {
    const where: Prisma.FormSubmissionWhereInput = {}
    
    if (query.form) {
      where.form = Number(query.form)
    }
    if (query.student) {
      where.student = Number(query.student)
    }

    return await prisma.formSubmission.findMany({
      where
    })
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const formId = Number(body.form)
    const studentId = Number(body.student)

    const existingSubmission = await prisma.formSubmission.findFirst({
      where: {
        form: formId,
        student: studentId,
      },
    })

    if (existingSubmission) {
      setResponseStatus(event, 409)
      return {
        error: 'DUPLICATE_SUBMISSION',
        message: 'This form has already been submitted by this student.',
        submission: existingSubmission,
      }
    }

    const createdSubmission = await prisma.formSubmission.create({
      data: {
        form: formId,
        student: studentId,
      },
    })

    setResponseStatus(event, 201)
    return {
      created: true,
      submission: createdSubmission,
    }
  }
})