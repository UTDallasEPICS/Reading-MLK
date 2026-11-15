import { getQuery, getRouterParam } from 'h3'
import { prisma } from '../../../utils/prisma'
import { requireClassAccess } from '../../../utils/require-session'

export default defineEventHandler(async (event) => {
  const rawStudentId = getRouterParam(event, 'id')
  const studentId = Number(rawStudentId)

  if (!rawStudentId || !Number.isInteger(studentId) || studentId < 1) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid student ID',
    })
  }

  const query = getQuery(event)
  const classToken = typeof query.classId === 'string' ? query.classId.trim() : ''

  if (!classToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'classId is required',
    })
  }

  const { classId } = await requireClassAccess(event, classToken)
  const student = await prisma.student.findFirst({
    where: {
      id: studentId,
      Classes: { some: { id: classId } },
    },
    select: {
      id: true,
      name: true,
      exp: true,
      Classes: {
        where: { id: classId },
        select: { name: true },
      },
      Submissions: {
        where: { Form: { FormGroup: { class: classId } } },
        orderBy: { submissionDate: 'desc' },
        select: {
          id: true,
          submissionDate: true,
          Form: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  })

  if (!student) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Student not found in this class',
    })
  }

  return {
    id: student.id,
    name: student.name,
    experience: student.exp,
    className: student.Classes[0]?.name ?? '',
    submissions: student.Submissions.map((submission) => ({
      id: submission.id,
      form: submission.Form.title,
      submittedAt: submission.submissionDate,
    })),
  }
})
