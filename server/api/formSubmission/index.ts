import { Prisma } from '~~/prisma/generated/client'
import { prisma } from '../../utils/prisma'
import { getQuery, createError } from 'h3'
import { requireSession } from '../../utils/require-session'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const query = getQuery(event)
  const session = await requireSession(event)
  const isAdmin = session.user.role === 'admin'

  if (method === 'GET') {
    const where: Prisma.FormSubmissionWhereInput = {}
    
    if (query.form) {
      where.form = Number(query.form)
    }
    if (query.student) {
      where.student = Number(query.student)
    }
    if (query.formGroup) {
      where.Form = {
        formGroup: Number(query.formGroup)
      }
    }

    if (!isAdmin) {
      const ownStudents = await prisma.student.findMany({
        where: { parentUserId: session.user.id },
        select: { id: true },
      })

      const ownStudentIds = ownStudents.map((student) => student.id)

      if (query.student && !ownStudentIds.includes(Number(query.student))) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Forbidden',
        })
      }

      where.student = {
        in: ownStudentIds,
      }
    }

    return await prisma.formSubmission.findMany({ where })
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const studentId = Number(body.student)

    if (!isAdmin) {
      const student = await prisma.student.findFirst({
        where: {
          id: studentId,
          parentUserId: session.user.id,
        },
      })

      if (!student) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Forbidden',
        })
      }
    }

    return await prisma.formSubmission.create({
      data: {
        form: Number(body.form),
        student: studentId,
      },
    })
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method Not Allowed',
  })
})