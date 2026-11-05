import { prisma } from '../../../utils/prisma'
import { requireSession } from '../../../utils/require-session'

export default defineEventHandler(async (event) => {
  const session = await requireSession(event)
  const studentId = Number(event.context.params?.id)

  if (!Number.isInteger(studentId) || studentId < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid student ID' })
  }

  const body = await readBody(event)
  const joinToken = typeof body?.joinToken === 'string' ? body.joinToken.trim().toUpperCase() : ''

  if (!/^[A-Z0-9]{5}$/.test(joinToken)) {
    throw createError({ statusCode: 400, statusMessage: 'Class code must be 5 letters or numbers' })
  }

  const student = await prisma.student.findFirst({
    where: { id: studentId, parentUserId: session.user.id },
    select: { id: true },
  })

  if (!student) {
    throw createError({ statusCode: 404, statusMessage: 'Student not found' })
  }

  const classroom = await prisma.class.findUnique({
    where: { joinToken },
    select: { id: true, name: true },
  })

  if (!classroom) {
    throw createError({ statusCode: 404, statusMessage: 'Class code not found' })
  }

  await prisma.student.update({
    where: { id: student.id },
    data: { Classes: { connect: { id: classroom.id } } },
  })

  return { id: classroom.id, name: classroom.name }
})