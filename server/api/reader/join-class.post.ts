import { prisma } from '../../utils/prisma'
import { requireSession } from '../../utils/require-session'

/**
 * POST /api/reader/join-class
 * Body: { studentId: number, joinToken: string }
 *
 * Enrolls the given student (who must belong to the calling user) into the
 * class identified by `joinToken`. Idempotent — safe to call if already enrolled.
 */
export default defineEventHandler(async (event) => {
  const session = await requireSession(event)
  const body = await readBody(event)

  const studentId = typeof body?.studentId === 'number' ? body.studentId : NaN
  const joinToken  = typeof body?.joinToken  === 'string' ? body.joinToken.trim()  : ''

  if (!studentId || Number.isNaN(studentId)) {
    throw createError({ statusCode: 400, statusMessage: 'studentId is required' })
  }

  if (!joinToken) {
    throw createError({ statusCode: 400, statusMessage: 'joinToken is required' })
  }

  // Verify the student belongs to the session user
  const student = await prisma.student.findFirst({
    where: { id: studentId, parentUserId: session.user.id },
    select: { id: true },
  })

  if (!student) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // Find the class by joinToken
  const classroom = await prisma.class.findUnique({
    where: { joinToken },
    select: { id: true, name: true, joinToken: true },
  })

  if (!classroom) {
    throw createError({ statusCode: 404, statusMessage: 'Class not found. Check the join code and try again.' })
  }

  // Enroll (connect is idempotent in Prisma)
  await prisma.class.update({
    where: { id: classroom.id },
    data: {
      Students: { connect: { id: studentId } },
    },
  })

  return { id: classroom.id, name: classroom.name, joinToken: classroom.joinToken }
})
