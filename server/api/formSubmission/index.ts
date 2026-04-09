import { Prisma } from '~~/prisma/generated/client'
import { prisma } from '../../utils/prisma'
import { getQuery } from 'h3'

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
    return await prisma.formSubmission.create({
      data: {
        form: Number(body.form),
        student: Number(body.student)
      }
    })
  }
})